'use client';
import Pocketbase, { RecordModel } from "pocketbase";
import styles from "./popup.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Edit({ id, type, equipment, schedules, setShown }: { id: string, type: string, equipment: RecordModel, schedules: RecordModel[], setShown: (shown: boolean) => void }) {
    const router = useRouter();
    const [name, setName] = useState(equipment.label);
    const [obs, setObs] = useState(equipment.obs);

    const save = async () => {
        await fetch("/api/db/update", {
            method: "POST",
            body: JSON.stringify({
                collection: type,
                id: id,
                body: {
                    label: name,
                    obs: obs
                }
            })
        });

        router.refresh();
        setShown(false);
    }

    const cancel = () => {
        setName(equipment.label);
        setObs(equipment.obs);
        router.refresh();
        setShown(false);
    }

    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <label className={`${styles.label}`}>
                    Nome
                    <input className={`${styles.input}`} type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
                </label>
                <label className={`${styles.label}`}>
                    Observação
                    <input className={`${styles.input}`} type="text" defaultValue={obs} onChange={e => setObs(e.target.value)} />
                </label>
                <div className={`${styles.buttons}`}>
                    <button className={`${styles.button}`} onClick={save} type="submit">Salvar</button>
                    <button className={`${styles.button}`} onClick={cancel} type="button">Cancelar</button>
                </div>
            </div>
        </div>
    )
}