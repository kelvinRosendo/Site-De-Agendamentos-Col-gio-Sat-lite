'use client';
import { RecordModel } from "pocketbase";
import Schedule from "./Schedule";
import styles from "./page.module.css";

export default function ScheduleCategory({ type, schedules: schedule }: { type: string, schedules: RecordModel[] }) {
    let label = "";

    switch (type) {
        case 'chrome':
            label = "Chromebooks";
            break;
        case 'lab':
            label = "Laboratório";
            break;
        case 'speaker':
            label = "Caixa de Som";
            break;
        default:
            console.error("Unknown schedule type");
            break;
    }

    return (
        <div className={`${styles.category}`}>
            <h3>{label}</h3>
            <p className={`${styles.amount}`}>Você possui {schedule.length} solicitações de {label} ativas.</p>
            <div className={`${styles.schedules}`}>
                {schedule.map(s => {
                    return (
                        <Schedule key={s.id} type={type} schedule={s} />
                    )
                })}
            </div>
        </div>
    )
}