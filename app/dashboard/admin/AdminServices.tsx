'use client';

import { useState } from "react";
import serviceTypes from "../serviceTypes";
import { RecordModel } from "pocketbase";
import AdminService from "./AdminService";
import styles from "./page.module.css";

export default function AdminServices({ data }: {
    data: {
        chromes: RecordModel[]; labs: RecordModel[];
        speakers: RecordModel[]; chromeScheduleInfo: RecordModel[]; chromeSchedule: RecordModel[]; labScheduleInfo: RecordModel[];
        labSchedule: RecordModel[]; speakerScheduleInfo: RecordModel[]; speakerSchedule: RecordModel[];
    }
}) {
    const [type, setType] = useState(serviceTypes.chrome);
    const [enabled, setEnabled] = useState(false);

    const scheduleInfo = new Map<string, RecordModel[]>();
    const schedule = new Map<string, RecordModel[]>();
    const equipment = new Map<string, RecordModel[]>();

    scheduleInfo.set(serviceTypes.chrome, data.chromeScheduleInfo);
    scheduleInfo.set(serviceTypes.lab, data.labScheduleInfo);
    scheduleInfo.set(serviceTypes.speaker, data.speakerScheduleInfo);
    schedule.set(serviceTypes.chrome, data.chromeSchedule);
    schedule.set(serviceTypes.lab, data.labSchedule);
    schedule.set(serviceTypes.speaker, data.speakerSchedule);
    equipment.set(serviceTypes.chrome, data.chromes);
    equipment.set(serviceTypes.lab, data.labs);
    equipment.set(serviceTypes.speaker, data.speakers);

    const click = async (t: string) => {
        if (type == t) {
            setEnabled(!enabled);
        } else {
            setEnabled(false);
            const interval = setTimeout(() => {
                setType(t);
                setEnabled(true);
            }, 1000);
        }
    };

    return (
        <div className={`${styles.services}`}>
            <div className={`${styles.buttons}`}>
                <button onClick={() => { click(serviceTypes.chrome) }}><img src="/chromes.png" height="100px" /></button>
                <button onClick={() => { click(serviceTypes.lab) }}><img src="/labs.png" height="100px" /></button>
            </div>

            <div className={`${styles.forms} ${enabled ? styles.enabled : ''}`}>
                <AdminService data={{
                    type: type != '' ? type : serviceTypes.chrome,
                    equipment: equipment.get(type != '' ? type : serviceTypes.chrome)!,
                    scheduleInfo: scheduleInfo.get(type != '' ? type : serviceTypes.chrome)!,
                    schedule: schedule.get(type != '' ? type : serviceTypes.chrome)!,
                }} />
            </div>
        </div>
    )
}