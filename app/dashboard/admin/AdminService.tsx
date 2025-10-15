'use client';

import { format } from "date-fns/format";
import { RecordModel } from "pocketbase";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Returning from "./Returning";
import Deleting from "./Deleting";
import CreateEquipment from "./CreateEquipment";
import Edit from "./Edit";
import Chromes from "./Chromes";
import Link from "next/link";

export default function AdminService({ data }: { data: { type: string; equipment: RecordModel[]; scheduleInfo: RecordModel[]; schedule: RecordModel[] } }) {
    const [returnShown, setReturnShown] = useState(false);
    const [deleteShown, setDeleteShown] = useState(false);
    const [editShown, setEditShown] = useState(false);
    const [chromeShown, setChromeShown] = useState(false);
    const [id, setId] = useState('');
    const [collection, setCollection] = useState('');
    let title = 'Inválido';

    switch (data.type) {
        case 'chrome':
            title = 'Chromebooks';
            break;
        case 'speaker':
            title = 'Caixas de Som';
            break;
        case 'lab':
            title = 'Laboratórios';
            break;
        default:
            break;
    }

    let active = data.scheduleInfo.filter(i => data.schedule.some(s => s.schedule_info == i.id && !s.returned));
    active = active.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    let returned = data.scheduleInfo.filter(i => !data.schedule.some(s => s.schedule_info == i.id && !s.returned));
    returned = returned.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    return (
        <div className={`${styles.service}`}>
            {chromeShown && data.type == 'chrome' ? <Chromes schedule={data.scheduleInfo.find(s => s.id == id)!} setShown={setChromeShown} /> : ''}
            {returnShown ? <Returning id={id} schedules={data.schedule} setShown={setReturnShown} /> : ''}
            {deleteShown ? <Deleting id={id} collection={collection} schedules={data.schedule} setShown={setDeleteShown} /> : ''}
            {editShown ? <Edit id={id} type={data.type} equipment={data.equipment.find(e => e.id == id)!} schedules={data.schedule} setShown={setEditShown} /> : ''}
            <h2>Solicitações de {title}</h2>
            <div className={`${styles.twrapper}`}>
            <table className={`${styles.schedules}`}>
                    <thead>
                        <tr className={`${styles.header}`}>
                            <th colSpan={8}>Solicitações Ativas</th>
                        </tr>
                        <tr className={`${styles.header}`}>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>Turma</th>
                            <th>Usuário</th>
                            <th>Equipamento</th>
                            <th>Status</th>
                            <th>Observações</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {active.map(s => <ScheduleLine setId={setId} setCollection={setCollection} setReturnShown={setReturnShown} setDeleteShown={setDeleteShown}
                            setChromeShown={setChromeShown} key={s.id} type={data.type} id={s.id} collection={s.collectionName} data={
                                {
                                    created: s.created,
                                    start: new Date(Date.parse(s.start)),
                                    end: new Date(Date.parse(s.end)),
                                    start_time: s.start_time,
                                    end_time: s.end_time,
                                    repeat: s.repeat,
                                    grade: s.expand?.grade,
                                    class: s.expand?.class,
                                    user: s.user,
                                    obs: s.obs,
                                    chrome: s.chrome,
                                    lab: s.expand?.lab ? s.expand.lab.label : '',
                                    speaker: s.expand?.speaker ? s.expand.speaker.label : ''
                                }
                            } schedules={data.schedule.filter(sch => sch.schedule_info == s.id)} />)}
                    </tbody>
                </table>
            </div>
            <div className={`${styles.twrapper}`}>
                <table className={`${styles.schedules}`}>
                    <thead>
                        <tr className={`${styles.header}`}>
                            <th colSpan={6}>Equipamentos</th>
                        </tr>
                        <tr className={`${styles.header}`}>
                            <th>Nome</th>
                            <th>Último Usuário</th>
                            <th>Última Devolução</th>
                            <th>Status</th>
                            <th>Ocupado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.equipment.map(s => <EquipmentLine setId={setId} setCollection={setCollection} setEditShown={setEditShown} setDeleteShown={setDeleteShown}
                            key={s.id} type={data.type} id={s.id} collection={s.collectionName} data={
                                {
                                    created: s.created,
                                    label: s.label,
                                    occupied: s.occupied,
                                    obs: s.obs
                                }
                            } schedules={data.schedule} info={data.scheduleInfo} />)}
                        <CreateEquipment type={data.type} />
                    </tbody>
                </table>
            </div>
            <div className={`${styles.twrapper}`}>
                <table className={`${styles.schedules}`}>
                    <thead>
                        <tr className={`${styles.header}`}>
                            <th colSpan={8}>Solicitações devolvidas</th>
                        </tr>
                        <tr className={`${styles.header}`}>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>Turma</th>
                            <th>Usuário</th>
                            <th>Equipamento</th>
                            <th>Status</th>
                            <th>Observações</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returned.map(s => <ScheduleLine setId={setId} setCollection={setCollection} setReturnShown={setReturnShown} setDeleteShown={setDeleteShown}
                            setChromeShown={setChromeShown} key={s.id} type={data.type} id={s.id} collection={s.collectionName} data={
                                {
                                    created: s.created,
                                    start: new Date(Date.parse(s.start)),
                                    end: new Date(Date.parse(s.end)),
                                    start_time: s.start_time,
                                    end_time: s.end_time,
                                    repeat: s.repeat,
                                    grade: s.expand?.grade,
                                    class: s.expand?.class,
                                    user: s.user,
                                    obs: s.obs,
                                    chrome: s.chrome,
                                    lab: s.expand?.lab ? s.expand.lab.label : '',
                                    speaker: s.expand?.speaker ? s.expand.speaker.label : ''
                                }
                            } schedules={data.schedule.filter(sch => sch.schedule_info == s.id)} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function EquipmentLine({ setId, setCollection, setEditShown, setDeleteShown, type, id, collection, data, schedules, info }: {
    setId: (id: string) => void, setCollection: (collection: string) => void, setEditShown: (shown: boolean) => void, setDeleteShown: (shown: boolean) => void, type: string, id: string, collection: string, data: {
        created: Date, label: string, occupied: boolean, obs: string
    }, schedules: RecordModel[], info: RecordModel[]
}) {
    const router = useRouter();

    const editShow = () => {
        setId(id);
        setEditShown(true);
    };

    const deleteShow = () => {
        setId(id);
        setCollection(collection);
        setDeleteShown(true);
    };

    const updateOccupied = async (e: ChangeEvent) => {
        await fetch("/api/db/update", {
            method: "POST",
            body: JSON.stringify({
                collection: type,
                id: id,
                body: {
                    occupied: (e.target as HTMLInputElement).checked
                }
            })
        });

        router.refresh();
    };

    let status = 'Disponível';

    if (schedules.some((s: RecordModel) => s.returned && s[type].includes(id))) status = 'Disponível';
    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) > new Date() && s[type].includes(id))) status = 'Agendado';
    if (schedules.some((s: RecordModel) => new Date(Date.parse(s.end) + 10800000) < new Date() && !s.late && !s.returned && s[type].includes(id))) status = 'Aguardando Devolução';
    if (schedules.some((s: RecordModel) => new Date(Date.parse(s.start) + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) >= new Date() && s[type].includes(id))) status = 'Em uso';
    if (schedules.some((s: RecordModel) => s.late && !s.returned && s[type].includes(id))) status = 'Atrasado';
    if (data.occupied) status = 'Ocupado';

    const lastSchedule = schedules.sort((a, b) => Date.parse(a.start) - Date.parse(b.start)).findLast(s => new Date(Date.parse(s.end) + 10800000) < new Date() && s[type].includes(id));

    return (
        <tr className={`${styles.schedule}`}>
            <td>
                <Link href={`/dashboard/equipment/${type}/${id}`}>{data.label}</Link>
                {data.obs ? <div className={`${styles.obs}`}>{data.obs}</div> : ''}
            </td>
            <td>
                <Link href={`/dashboard/equipment/${type}/${id}`}>{lastSchedule && info.find(s => lastSchedule.schedule_info == s.id) ? info.find(s => lastSchedule.schedule_info == s.id)?.user.name : 'Nenhum'}            </Link>
            </td>
            <td>
                <Link href={`/dashboard/equipment/${type}/${id}`}>{lastSchedule ? format(lastSchedule.end, "dd'/'MM'/'yyyy 'às' HH:mm") : 'Nenhum'}</Link>
            </td>
            <td>
                <Link href={`/dashboard/equipment/${type}/${id}`}>{status}</Link>
            </td>
            <td>
                <label className={`${styles.checkbox}`}>
                    <span></span>
                    Ocupado
                    <input type="checkbox" onChange={updateOccupied} defaultChecked={data.occupied} />
                </label>
            </td>
            <td className={`${styles.actions}`}>
                <button className={`${styles.action}`} onClick={editShow}>Editar</button>
                <button className={`${styles.action} ${styles.delete}`} onClick={deleteShow}>Deletar</button>
            </td>
        </tr>
    )
}

export function ScheduleLine({ setId, setCollection, setReturnShown, setDeleteShown, setChromeShown, type, id, collection, data, schedules }: {
    setId: (id: string) => void, setCollection: (collection: string) => void, setReturnShown: (shown: boolean) => void, setDeleteShown: (shown: boolean) => void, setChromeShown: (shown: boolean) => void, type: string, id: string, collection: string, data: {
        created: Date, start: Date, end: Date,
        start_time: string, end_time: string, repeat: string,
        grade: RecordModel, class: RecordModel, user: any, obs: string, lab?: string, speaker?: string, chrome?: string[]
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

    const chromeShow = () => {
        setId(id);
        setChromeShown(true);
    }

    let status = 'Status Inválido';

    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) > new Date())) status = 'Agendado';
    if (schedules.some(s => new Date(Date.parse(s.end) + 10800000) < new Date() && !s.returned && !s.late)) status = 'Aguardando Devolução';
    if (schedules.some(s => new Date(Date.parse(s.start) + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) >= new Date())) status = 'Em uso';
    if (schedules.some(s => s.late)) status = 'Atrasado';
    if (schedules.every(s => s.returned)) status = 'Devolvido';

    return (
        <tr className={`${styles.schedule}`}>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{data.repeat == 'norepeat' ?
                    format(data.start, 'dd/MM/yyyy')
                    :
                    format(data.start, 'dd/MM/yyyy') + " até " + format(data.end, 'dd/MM/yyyy')}</Link>
            </td>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{data.start_time} até {data.end_time}</Link>
            </td>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{data.grade.label}{data.class ? " " + data.class.label : ''}</Link>
            </td>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{data.user.name}</Link>
            </td>
            <td>
                {type == 'lab' ? <Link href={`/dashboard/schedule/${type}/${id}`}>{data.lab}</Link> : type == 'speaker' ? <Link href={`/dashboard/schedule/${type}/${id}`}>{data.speaker}</Link> : type == 'chrome' ? <button className={`${styles.chromes}`} onClick={chromeShow}>{data.chrome?.length + ' Chromes'}</button> : ''}
            </td>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{status}</Link>
            </td>
            <td>
                <Link href={`/dashboard/schedule/${type}/${id}`}>{data.obs}</Link>
            </td>
            <td className={`${styles.actions}`}>
                <button className={`${styles.action}`} onClick={returnShow}>Devolução</button>
                <button className={`${styles.action} ${styles.delete}`} onClick={deleteShow}>Deletar</button>
            </td>
        </tr>
    )
}