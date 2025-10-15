'use client';

import DateRange from "@/app/DateRange";
import { RecordModel } from "pocketbase";
import { useState, FormEvent, useEffect } from "react";
import DateComponent from "../components/FormDateComponent";
import Select from "../components/SelectComponent";
import scheduleDateCheck from "../ScheduleDateCheck";
import validDate from "../ValidDate";
import styles from "./service.module.css";
import components from "../components/components.module.css";
import ErrorPopup from "../ErrorPopup";
import SuccessPopup from "../SuccessPopup";
import LoaderPopup from "@/app/LoaderPopup";
import { useRouter } from "next/navigation";
import fixedClassCheck from "../FixedClassesCheck";
import Cookies from 'js-cookie';
import { Session } from "next-auth";

export default function LabsService({ data }: { data: { grades: RecordModel[], classes: RecordModel[], labs: RecordModel[], schedule: RecordModel[], fixed_classes: RecordModel[] } }) {
    const [date, setDate] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [repeat, setRepeat] = useState('norepeat');
    const w: string[] = [];
    const [weekDays, setWeekDays] = useState(w);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [grade, setGrade] = useState('');
    const [gradeClass, setGradeClass] = useState('');
    const [lab, setLab] = useState('');
    const [obs, setObs] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState(0);

    let labsSelect: { label: any; value: string; disabled: boolean; }[] = [];

    data.labs.forEach(l => {
        const item = {
            label: l.label,
            value: l.id,
            disabled: l.occupied || data.schedule.some(s => scheduleDateCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays, s, l.id, 'lab')) || (startTime == '' || endTime == '') || fixedClassCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays, data.fixed_classes, l.id)
        }
        labsSelect.push(item);
    });

    const router = useRouter();

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validDate(new Date(Date.parse(date)), repeat, new Date(Date.parse(dateEnd)), weekDays)) {
            setErrorCode(1);
            setError(true);
            return;
        };

        const start = new Date(Date.parse(date));
        const end = new Date(Date.parse(dateEnd) + 86400000);

        const start_time = new Date(Date.parse(`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${startTime}`));
        const end_time = new Date(Date.parse(`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${endTime}`));

        if (start_time >= end_time) {
            setErrorCode(2);
            setError(true);
            return;
        }

        if (start_time < new Date(Date.now() + 25200000)) {
            setErrorCode(5);
            setError(true);
            return;
        }

        setLoading(true);

        const session = await fetch("/api/auth/session").then(res => res.json());

        const info = await fetch("/api/db/create", {
            method: "POST",
            body: JSON.stringify({
                collection: 'lab_schedule_info',
                body: {
                    grade: grade,
                    class: gradeClass,
                    obs: obs,
                    user: session?.user,
                    start: start,
                    end: end,
                    start_time: startTime,
                    end_time: endTime,
                    repeat: repeat,
                    week_days: weekDays,
                    lab: lab
                }
            })
        }).then(res => res.json());

        let scheduledDays: DateRange[] = [];

        if (repeat == 'norepeat') {
            scheduledDays.push(new DateRange(start, Number(startTime.split(':')[0]), Number(startTime.split(':')[1]),
                Number(endTime.split(':')[0]), Number(endTime.split(':')[1])));
        }

        if (repeat == 'everyday') {
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                scheduledDays.push(new DateRange(d, Number(startTime.split(':')[0]), Number(startTime.split(':')[1]),
                    Number(endTime.split(':')[0]), Number(endTime.split(':')[1])));
            }
        }

        if (repeat == 'weekly') {
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                if (weekDays.some(w => Number(w) == d.getDay())) scheduledDays.push(new DateRange(d, Number(startTime.split(':')[0]),
                    Number(startTime.split(':')[1]), Number(endTime.split(':')[0]), Number(endTime.split(':')[1])));
            }
        }


        await fetch("/api/db/batch/create", {
            method: "POST",
            body: JSON.stringify({
                items: scheduledDays.map(range => {
                    return {
                        collection: 'lab_schedule',
                        body: {
                            schedule_info: info.id,
                            start: range.start,
                            end: range.end,
                            lab: lab,
                            returned: false
                        }
                    }
                })
            })
        });

        fetch(`https://hook.us2.make.com/lt688h3jfsfllqn25i92p3yirvcfcd1g?id=${info.id}&collection=lab`);

        setLoading(false);
        setSuccess(true);

        setDate('');
        setDateEnd('');
        setRepeat('norepeat');
        const nw: string[] = [];
        setWeekDays(nw);
        setStartTime('');
        setEndTime('');
        setGrade('');
        setGradeClass('');
        setLab('');
        setObs('');

        (e.target as HTMLFormElement).reset();
    }

    return (
        <form onSubmit={(e) => submit(e)} className={`${styles.form}`}>
            {loading ? <LoaderPopup /> : ''}
            {success ? <SuccessPopup toggle={setSuccess} /> : ''}
            {error ? <ErrorPopup toggle={setError} code={errorCode} /> : ''}
            <h3>Agendar Laboratórios</h3>
            <DateComponent onChange={(date, dateEnd, repeat, weekDays) => {
                setDate(date);
                setDateEnd(dateEnd);
                setRepeat(repeat);
                setWeekDays(weekDays);
            }} />
            <div className={`${styles.time}`}>
                <label className={`${components.input}`}>
                    Empréstimo
                    <input id="emprestimo" type="time" onChange={(e) => { setStartTime(e.target.value) }} />
                </label>
                <label className={`${components.input}`}>
                    Devolução
                    <input id="emprestimo" type="time" onChange={(e) => { setEndTime(e.target.value) }} />
                </label>
            </div>
            <div className={`${styles.time}`}>
                <label className={`${components.input}`}>
                    Série
                    <Select items={data.grades.map(g => {
                        return {
                            label: g.label,
                            value: g.id
                        }
                    })} onClick={(value) => { value && data.grades.some(g => g.id == value) ? setGrade(value) : setGrade('') }} required={true} />
                </label>
                {grade != '' && data.grades.find(g => g.id == grade)!.classes.length > 0 ? <label className={`${components.input}`}>
                    Turma
                    <Select items={data.grades.find(g => g.id == grade)?.expand?.classes.map((c: any) => {
                        return {
                            label: c.label,
                            value: c.id
                        };
                    })} onClick={(value) => value ? setGradeClass(value) : setGradeClass('')} required={true} />
                </label> : null}
            </div>
            <label className={`${components.input}`}>
                Laboratório
                <Select items={labsSelect} onClick={(value) => { value ? setLab(value) : setLab('') }} required={true} />
            </label>
            <input type="text" className={`${styles.input}`} placeholder="Observação" onChange={(e) => setObs(e.target.value ? e.target.value : "")} />
            <button type="submit" className={`${styles.button}`}>Agendar</button>
        </form>
    )
}