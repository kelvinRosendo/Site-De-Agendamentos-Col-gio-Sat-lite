'use client';
import Pocketbase, { RecordModel } from "pocketbase";
import styles from "./popup.module.css";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Returning({ id, schedules, setShown }: { id: string, schedules: RecordModel[], setShown: (shown: boolean) => void }) {
    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <table className={`${styles.schedules}`}>
                    <tbody>
                        <tr className={`${styles.header}`}>
                            <td>Data</td>
                            <td>Empréstimo</td>
                            <td>Devolução</td>
                            <td>Status</td>
                            <td>Atrasado</td>
                            <td>Devolvido</td>
                        </tr>
                        {schedules.map(s => s.schedule_info == id ? <Schedule key={s.id} schedule={s} /> : '')}
                    </tbody>
                </table>
                <button className={`${styles.button}`} onClick={() => setShown(false)}>Fechar</button>
            </div>
        </div>
    )
}

export function Schedule({ schedule }: { schedule: RecordModel }) {
    const router = useRouter();
    let status = 'Status Inválido';

    if (new Date(Date.parse(schedule.start) + 10800000) > new Date()) status = 'Agendado';
    if (new Date(Date.parse(schedule.end) + 10800000) < new Date()) status = 'Aguardando Devolução';
    if (new Date(Date.parse(schedule.start) + 10800000) <= new Date() && new Date(Date.parse(schedule.end) + 10800000) >= new Date()) status = 'Em uso';
    if (schedule.late) status = 'Atrasado';
    if (schedule.returned) status = 'Devolvido';

    const setLate = async (e: ChangeEvent) => {
        await fetch("/api/db/update", {
            method: "POST",
            body: JSON.stringify({
                collection: schedule.collectionId,
                id: schedule.id,
                body: {
                    late: (e.target as HTMLInputElement).checked
                }
            })
        });
        
        router.refresh();
    }

    const setReturn = async (e: ChangeEvent) => {
        await fetch("/api/db/update", {
            method: "POST",
            body: JSON.stringify({
                collection: schedule.collectionId,
                id: schedule.id,
                body: {
                    returned: (e.target as HTMLInputElement).checked
                }
            })
        });
        
        router.refresh();
    }

    return (
        <tr className={`${styles.schedule}`}>
            <td>{format(new Date(Date.parse(schedule.start) + 10800000), "dd'/'MM'/'yyyy")}</td>
            <td>{format(new Date(Date.parse(schedule.start) + 10800000), "HH:mm")}</td>
            <td>{format(new Date(Date.parse(schedule.end) + 10800000), "HH:mm")}</td>
            <td>{status}</td>
            <td>
                <label className={`${styles.checkbox}`}>
                    <span></span>
                    Atrasado
                    <input type="checkbox" onChange={setLate} defaultChecked={schedule.late} />
                </label>
            </td>
            <td>
                <label className={`${styles.checkbox}`}>
                    <span></span>
                    Devolvido
                    <input type="checkbox" onChange={setReturn} defaultChecked={schedule.returned} />
                </label>
            </td>
        </tr>
    )
}