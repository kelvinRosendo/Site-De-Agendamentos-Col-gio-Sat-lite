'use client';
import { ChangeEvent } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { RecordModel } from "pocketbase";

export default function UpdateStatus({ schedule }: { schedule: RecordModel }) {
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
        <div>
            <label className={`${styles.checkbox}`}>
                <span></span>
                Atrasado
                <input type="checkbox" onChange={setLate} defaultChecked={schedule.late} />
            </label>
            <label className={`${styles.checkbox}`}>
                <span></span>
                Devolvido
                <input type="checkbox" onChange={setReturn} defaultChecked={schedule.returned} />
            </label>
        </div>
    )
}