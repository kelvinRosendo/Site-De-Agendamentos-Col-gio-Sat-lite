'use client'

import { RecordModel } from "pocketbase";
import { format } from 'date-fns';
import { ptBR, ta } from "date-fns/locale";
import styles from "./page.module.css";
import { useState } from "react";

export default function Schedule({ type, schedule }: { type: string; schedule: RecordModel }) {
    const [expanded, setExpanded] = useState(false);
    
    let titleIdentifier = "";

    switch (type) {
        case 'chrome':
            titleIdentifier = `${schedule.chrome.length} Chromes`;
            break;
        case 'lab':
            titleIdentifier = `${schedule.expand?.lab.label}`;
            break;
        case 'speaker':
            titleIdentifier = `${schedule.expand?.speaker.label}`;
            break;
        default:
            console.error("Unknown schedule type");
            break;
    }

    let date = format(schedule.start, "d 'de' MMMM 'de' yyyy", {
        locale: ptBR
    });

    switch (schedule.repeat) {
        case 'everyday':
            date = `Todos os dias de ${format(schedule.start, "dd'/'MM'/'yyyy", { locale: ptBR })} até ${format(schedule.end, "dd'/'MM'/'yyyy", { locale: ptBR })}`;
            break;
        case 'weekly':
            let weekdays = schedule.expand?.week_days.map((w: RecordModel) => w.label + 's').reduce((acc: string, cur: string, i: number, arr: string[]) => {
                if (i == arr.length - 1) return acc.concat(` e ${cur}`);
                return acc.concat(`, ${cur}`);
            });
            date = `${String(weekdays[0]).toUpperCase() + String(weekdays).slice(1)} de ${format(schedule.start, "dd'/'MM'/'yyyy", { locale: ptBR })} até ${format(schedule.end, "dd'/'MM'/'yyyy", { locale: ptBR })}`;
            break;
        default:
            break;
    }

    return (
        <div className={`${styles.item} ${expanded ? styles.expanded : ''}`}>
            <h4 className={`${styles.itemTitle}`} onClick={(e) => setExpanded(!expanded)}>{schedule.expand?.grade.label}{schedule.class ? " " + schedule.expand?.class.label : ""} - {titleIdentifier}</h4>
            <div className={`${styles.itemInfo}`}>
                <p><span>Data:</span> {date}</p>
                <p><span>Horário:</span> {schedule.start_time} até {schedule.end_time}</p>
                {schedule.obs && schedule.obs != '' ? <p><span>Observação:</span> {schedule.obs}</p> : ''}

                {type == 'chrome' ?
                    <ul className={`${styles.chromes}`}>
                        {schedule.expand?.chrome.map((c: RecordModel) => {
                            return (
                                <li key={c.id}>{c.label}</li>
                            )
                        })}
                    </ul>
                    : ''}

                {type == 'speaker' && schedule.expand?.speaker.obs && schedule.expand?.speaker.obs != '' ?
                    <p><span>Observação do equipamento:</span> {schedule.expand?.speaker.obs}</p>
                    : ''}

            </div>
        </div>
    )
}