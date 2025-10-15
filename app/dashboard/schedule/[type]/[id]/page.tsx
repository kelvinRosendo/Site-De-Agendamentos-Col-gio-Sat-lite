import Return from '@/app/Return';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cookies } from 'next/headers';
import PocketBase, { RecordModel } from 'pocketbase';
import styles from "./page.module.css";
import Edit from './Edit';
import Line from './Line';
import UpdateStatus from './UpdateStatus';
import Link from 'next/link';
import { createServerPB } from '@/pocketbase/core';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Schedule({ params }: any) {
    const pb = createServerPB();

    if ((await pb.collection("admins").getFullList({ filter: `email = '${(await getServerSession())?.user?.email || ""}'` })).length <= 0) {
        redirect('https://aliceapp.ia.br/api/auth/error?error=AccessDenied'); 
    }

    const { type, id } = await params;

    let [
        scheduleInfo,
        schedules,
        grades,
        classes,
        chromes,
        labs,
        chromeSchedule,
        labSchedule
    ] = await Promise.all([
        pb.collection(`${type}_schedule_info`).getOne(id, {
            expand: `${type},grade,class,week_days`
        }),
        pb.collection(`${type}_schedule`).getFullList({
            expand: `${type}`
        }),
        pb.collection('grades').getFullList({
            expand: "classes"
        }),
        pb.collection('classes').getFullList(),
        pb.collection('chrome').getFullList(),
        pb.collection('lab').getFullList(),
        pb.collection('chrome_schedule').getFullList({
            filter: `returned = false`
        }),
        pb.collection('lab_schedule').getFullList({
            filter: `returned = false`
        })
    ]);

    schedules = schedules.filter(s => s.schedule_info == id);

    let date = format(scheduleInfo.start, "cccc',' d 'de' MMMM 'de' yyyy", { locale: ptBR }).charAt(0).toUpperCase() + format(scheduleInfo.start, "cccc',' d 'de' MMMM 'de' yyyy", { locale: ptBR }).slice(1);

    switch (scheduleInfo.repeat) {
        case 'everyday':
            date = `Todos os dias de ${format(scheduleInfo.start, "dd'/'MM'/'yyyy", { locale: ptBR })} até ${format(scheduleInfo.end, "dd'/'MM'/'yyyy", { locale: ptBR })}`;
            break;
        case 'weekly':
            let weekdays = scheduleInfo.expand?.week_days.map((w: RecordModel) => w.label + 's').reduce((acc: string, cur: string, i: number, arr: string[]) => {
                if (i == arr.length - 1) return acc.concat(` e ${cur}`);
                return acc.concat(`, ${cur}`);
            });
            date = `${String(weekdays[0]).toUpperCase() + String(weekdays).slice(1)} de ${format(scheduleInfo.start, "dd'/'MM'/'yyyy", { locale: ptBR })} até ${format(scheduleInfo.end, "dd'/'MM'/'yyyy", { locale: ptBR })}`;
            break;
        default:
            break;
    }

    let status = 'Status Inválido';

    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) > new Date())) status = 'Agendado';
    if (schedules.some(s => new Date(Date.parse(s.end) + 10800000) < new Date())) status = 'Aguardando Devolução';
    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) >= new Date())) status = 'Em uso';
    if (schedules.some(s => s.late)) status = 'Atrasado';
    if (schedules.every(s => s.returned)) status = 'Devolvido';

    return (
        <div className={`${styles.page}`}>
            <div className={`${styles.buttons}`}>
                <Link href={"/dashboard/admin"} className={`${styles.button}`}>Voltar</Link>
                <Edit id={id} type={type} data={{
                    grades: grades,
                    classes: classes,
                    chromes: chromes,
                    labs: labs,
                    speakers: [],
                    chromeSchedule: chromeSchedule,
                    labSchedule: labSchedule,
                    speakerSchedule: []
                }} info={{
                    start: scheduleInfo.start,
                    end: scheduleInfo.end,
                    start_time: scheduleInfo.start_time,
                    end_time: scheduleInfo.end_time,
                    repeat: scheduleInfo.repeat,
                    weekdays: scheduleInfo.week_days,
                    grade: scheduleInfo.grade,
                    class: scheduleInfo.class,
                    chromes: scheduleInfo.chrome,
                    lab: scheduleInfo.lab,
                    speaker: scheduleInfo.speaker,
                    obs: scheduleInfo.obs
                }} />
            </div>
            <div className={`${styles.info}`}>
                <p><span>Status:</span> {status}</p>
                <p><span>Usuário:</span> {scheduleInfo.user.name}</p>
                <p><span>Email:</span> {scheduleInfo.user.email}</p>
                <p><span>Horário:</span> {scheduleInfo.start_time} até {scheduleInfo.end_time}</p>
                <p><span>Observação:</span> {scheduleInfo.obs != '' ? scheduleInfo.obs : 'Nenhuma'}</p>
                {type == 'lab' ? <p><span>Laboratório:</span> {scheduleInfo.expand?.lab.label}</p> : ''}
                {type == 'speaker' ? <p><span>Caixa de Som:</span> {scheduleInfo.expand?.speaker.label}</p> : ''}
                {type == 'chrome' ? <ul className={`${styles.chromes}`}>
                    {scheduleInfo.expand?.chrome.map((c: RecordModel) => {
                        return (
                            <li key={c.id}>{c.label}</li>
                        )
                    })}
                </ul> : ''}

                {scheduleInfo.repeat != 'norepeat' ? <div className={`${styles.twrapper}`}>
                    <h3>{date}</h3>
                    <table className={`${styles.schedules}`}>
                        <tbody>
                            <tr className={`${styles.header}`}>
                                <td>Data</td>
                                <td>Atrasado</td>
                                <td>Devolvido</td>
                            </tr>
                            {schedules.map((s: RecordModel) => {
                                return (<Line key={s.id} schedule={s} />)
                            })}
                        </tbody>
                    </table>
                </div> : ''}
                {scheduleInfo.repeat == 'norepeat' ? <div className={`${styles.schedule}`}>
                    <p><span>Data:</span> {date}</p>
                    <UpdateStatus schedule={schedules.find(s => s)!} />
                </div> : ''}
            </div>
        </div>
    )
}