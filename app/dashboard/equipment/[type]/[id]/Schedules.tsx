'use client';

import styles from "./page.module.css";
import { RecordModel } from 'pocketbase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { format } from "date-fns";
import Deleting from "@/app/dashboard/admin/Deleting";
import Returning from "@/app/dashboard/admin/Returning";

export default function Schedules({ type, id, active, schedules }: { type: string, id: string, active: RecordModel[], schedules: RecordModel[] }) {
    const [returnShown, setReturnShown] = useState(false);
    const [deleteShown, setDeleteShown] = useState(false);
    const [idSelected, setIdSelected] = useState('');
    const [collection, setCollection] = useState('');

    return (
        <div className={`${styles.schedulesdiv}`}>
            {returnShown ? <Returning id={idSelected} schedules={schedules} setShown={setReturnShown} /> : ''}
            {deleteShown ? <Deleting id={idSelected} collection={collection} schedules={schedules} setShown={setDeleteShown} /> : ''}
            <div className={`${styles.twrapper}`}>
                <h3>Solicitações Ativas</h3>
                <table className={`${styles.schedules}`}>
                    <tbody>
                        <tr className={`${styles.header}`}>
                            <td>Data</td>
                            <td>Horário</td>
                            <td>Turma</td>
                            <td>Usuário</td>
                            <td>Status</td>
                            <td>Ações</td>
                        </tr>
                        {active.map(s => <ScheduleLine setId={setIdSelected} setCollection={setCollection} setReturnShown={setReturnShown} setDeleteShown={setDeleteShown}
                            key={s.id} type={type} id={s.id} collection={s.collectionName} data={
                                {
                                    created: s.created,
                                    start: new Date(Date.parse(s.start)),
                                    end: new Date(Date.parse(s.end)),
                                    start_time: s.start_time,
                                    end_time: s.end_time,
                                    repeat: s.repeat,
                                    grade: s.expand?.grade,
                                    class: s.expand?.class,
                                    user: s.user
                                }
                            } schedules={schedules.filter(sch => sch.schedule_info == s.id)} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function ScheduleLine({ setId, setCollection, setReturnShown, setDeleteShown, type, id, collection, data, schedules }: {
    setId: (id: string) => void, setCollection: (collection: string) => void, setReturnShown: (shown: boolean) => void, setDeleteShown: (shown: boolean) => void, type: string, id: string, collection: string, data: {
        created: Date, start: Date, end: Date,
        start_time: string, end_time: string, repeat: string,
        grade: RecordModel, class: RecordModel, user: any
    }, schedules: RecordModel[]
}) {
    const router = useRouter();

    const returnShow = () => {
        setId(id);
        setReturnShown(true);
    };

    const deleteShow = () => {
        setId(id);
        setCollection(collection);
        setDeleteShown(true);
    };

    let status = 'Status Inválido';

    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) > new Date())) status = 'Agendado';
    if (schedules.some(s => new Date(Date.parse(s.end) + 10800000) < new Date())) status = 'Aguardando Devolução';
    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) >= new Date())) status = 'Em uso';
    if (schedules.some(s => s.late)) status = 'Atrasado';
    if (schedules.every(s => s.returned)) status = 'Devolvido';

    return (
        <tr className={`${styles.schedule}`}>
            <td onClick={(e) => router.push(`/dashboard/schedule/${type}/${id}`)}>
                {data.repeat == 'norepeat' ?
                    format(data.start, 'dd/MM/yyyy')
                    :
                    format(data.start, 'dd/MM/yyyy') + " até " + format(data.end, 'dd/MM/yyyy')}
            </td>
            <td onClick={(e) => router.push(`/dashboard/schedule/${type}/${id}`)}>
                {data.start_time} até {data.end_time}
            </td>
            <td onClick={(e) => router.push(`/dashboard/schedule/${type}/${id}`)}>
                {data.grade.label}{data.class ? " " + data.class.label : ''}
            </td>
            <td onClick={(e) => router.push(`/dashboard/schedule/${type}/${id}`)}>
                {data.user.name}
            </td>
            <td onClick={(e) => router.push(`/dashboard/schedule/${type}/${id}`)}>
                {status}
            </td>
            <td className={`${styles.actions}`}>
                <button className={`${styles.action}`} onClick={returnShow}>Devolução</button>
                <button className={`${styles.action} ${styles.delete}`} onClick={deleteShow}>Deletar</button>
            </td>
        </tr>
    )
}