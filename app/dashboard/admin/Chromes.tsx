'use client';
import Pocketbase, { RecordModel } from "pocketbase";
import styles from "./popup.module.css";
import Link from "next/link";

export default function Chromes({ schedule, setShown }: { schedule: RecordModel, setShown: (shown: boolean) => void }) {
    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <h3>Chromebooks selecionados</h3>
                <ul className={`${styles.chromeList}`}>
                    {schedule.expand?.chrome.map((c: RecordModel) => <li key={c.id} className={`${styles.chrome}`}>
                        <Link href={`/dashboard/equipment/chrome/${c.id}`}>{c.label}</Link>
                    </li>)}
                </ul>
                <button className={`${styles.button}`} onClick={() => setShown(false)}>Fechar</button>
            </div>
        </div>
    )
}