'use client';

import { useState } from "react";
import styles from "./page.module.css";
import Pocketbase, { RecordModel } from "pocketbase";
import { useRouter } from "next/navigation";

export default function CreateEquipment({ type }: { type: string }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [occupied, setOccupied] = useState(false);

    const create = async () => {
        if (name.trim() === '') return;

        const result = await fetch("/api/db/create", {
            method: "POST",
            body: JSON.stringify({
                collection: type,
                body: {
                    label: name,
                    occupied: occupied
                }
            })
        });

        setName('');
        setOccupied(false);
        router.refresh();
    }

    return (
        <tr className={`${styles.create}`}>
            <td><input className={`${styles.input}`} placeholder="Novo equipamento" onChange={(e) => setName(e.target.value)} type="text" defaultValue={name} /></td>
            <td>Nenhum</td>
            <td>Nenhum</td>
            <td>Disponível</td>
            <td>
                <label className={`${styles.checkbox}`}>
                    <span></span>
                    Ocupado
                    <input type="checkbox" onChange={(e) => setOccupied(e.target.checked)} defaultChecked={occupied} />
                </label>
            </td>
            <td>
                <button onClick={create} className={`${styles.action}`}> Adicionar </button>
            </td>
        </tr>
    )
}