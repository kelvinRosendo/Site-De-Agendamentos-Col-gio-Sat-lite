'use client';

import { RecordModel } from "pocketbase";
import { useState } from "react";
import ChromeService from "./services/ChromeService";
import LabsService from "./services/LabsService";
import serviceTypes from "./serviceTypes";
import styles from "./page.module.css";

export default function Services({ data }: {
    data: {
        grades: RecordModel[]; classes: RecordModel[]; chromes: RecordModel[];
        labs: RecordModel[]; speakers: RecordModel[]; chromeSchedule: RecordModel[]; labSchedule: RecordModel[];
        speakerSchedule: RecordModel[]; fixed_classes: RecordModel[]
    }
}) {
    const [type, setType] = useState(serviceTypes.none);

    const click = async (t: string) => {
        if (type == t) {
            setType('');
        } else {
            if (type != '') {
                setType('');
                const interval = setTimeout(() => {
                    setType(t);
                }, 500);
            } else {
                setType(t);
            }
        }
    };

    return (
        <div className={`${styles.services}`}>
            <div className={`${styles.buttons}`}>
                <button onClick={() => { click(serviceTypes.chrome) }}><img src="/chromes.png" height="100px" /></button>
                <button onClick={() => { click(serviceTypes.lab) }}><img src="/labs.png" height="100px" /></button>
            </div>

            <div className={`${styles.forms} ${type == serviceTypes.chrome ? styles.enabled : ''}`}>
                <ChromeService data={{
                    grades: data.grades,
                    classes: data.classes,
                    chromes: data.chromes,
                    schedule: data.chromeSchedule,
                }} />
            </div>

            <div className={`${styles.forms} ${type == serviceTypes.lab ? styles.enabled : ''}`}>
                <LabsService data={{
                    grades: data.grades,
                    classes: data.classes,
                    labs: data.labs,
                    schedule: data.labSchedule,
                    fixed_classes: data.fixed_classes
                }} />
            </div>
        </div>
    )
}