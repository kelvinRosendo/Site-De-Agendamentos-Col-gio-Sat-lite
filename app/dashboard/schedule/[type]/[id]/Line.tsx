'use client';
import { ChangeEvent } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Pocketbase, { RecordModel } from "pocketbase";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export default function Line({ schedule }: { schedule: RecordModel }) {
    const router = useRouter();

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
            <td>{format(schedule.start, "cccc',' d 'de' MMMM 'de' yyyy", { locale: ptBR }).charAt(0).toUpperCase() + format(schedule.start, "cccc',' d 'de' MMMM 'de' yyyy", { locale: ptBR }).slice(1)}</td>
            <td><label className={`${styles.checkbox}`}>
                <span></span>
                Atrasado
                <input type="checkbox" onChange={setLate} defaultChecked={schedule.late} />
            </label></td>
            <td><label className={`${styles.checkbox}`}>
                <span></span>
                Devolvido
                <input type="checkbox" onChange={setReturn} defaultChecked={schedule.returned} />
            </label></td>
        </tr>
    )
}