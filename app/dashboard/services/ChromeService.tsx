'use client';

import DateRange from "@/app/DateRange";
import { RecordModel } from "pocketbase";
import { useState, FormEvent, useEffect } from "react";
import DateComponent from "../components/FormDateComponent";
import MultiSelect from "../components/MultiSelectComponent";
import Select from "../components/SelectComponent";
import scheduleDateCheck from "../ScheduleDateCheck";
import validDate from "../ValidDate";
import Cookies from "js-cookie";
import styles from "./service.module.css";
import components from "../components/components.module.css";
import LoaderPopup from "@/app/LoaderPopup";
import SuccessPopup from "../SuccessPopup";
import ErrorPopup from "../ErrorPopup";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export default function ChromeService({ data }: { data: { grades: RecordModel[], classes: RecordModel[], chromes: RecordModel[], schedule: RecordModel[] } }) {
    const [date, setDate] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [repeat, setRepeat] = useState('norepeat');
    const w: string[] = [];
    const [weekDays, setWeekDays] = useState(w);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [grade, setGrade] = useState('');
    const [gradeClass, setGradeClass] = useState('');
    const [obs, setObs] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState(0);

    let chromesCheck: { label: any; value: string; disabled: boolean; }[] = [];

    data.chromes.forEach(c => {
        const item = {
            label: c.label,
            value: c.id,
            disabled: c.occupied || data.schedule.some(s => scheduleDateCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays, s, c.id, 'chrome')) || (startTime == '' || endTime == '')
        }
        chromesCheck.push(item);
    });

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let selected: string[] = [];
        let children = document.getElementById('checkboxes')?.querySelectorAll('input');

        for (let i = 0; i < children?.length!; i++) {
            const c = children?.item(i);
            if (c instanceof HTMLInputElement) {
                if (c.checked && !(c as HTMLInputElement).disabled) selected.push((c as HTMLElement).id);
            }
        }

        if (!validDate(new Date(Date.parse(date)), repeat, new Date(Date.parse(dateEnd)), weekDays)) {
            setErrorCode(1);
            setError(true);
            return;
        };

        const start = new Date(Date.parse(date));
        const end = new Date(Date.parse(dateEnd) + 86400000);

        if (selected.length <= 0) {
            setErrorCode(3);
            setError(true);
            return;
        }

        const start_time = new Date(Date.parse(`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${startTime}`));
        const end_time = new Date(Date.parse(`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${endTime}`));

        if (start_time >= end_time) {
            setErrorCode(2);
            setError(true);
            return;
        }

        if (start_time < new Date(Date.now() + 3000000) && selected.length > 5) {
            setErrorCode(4);
            setError(true);
            return;
        }

        setLoading(true);

        const session = await fetch("/api/auth/session").then(res => res.json());

        const info = await fetch("/api/db/create", {
            method: "POST",
            body: JSON.stringify({
                collection: 'chrome_schedule_info',
                body: {
                    grade: grade,
                    class: gradeClass,
                    obs: obs,
                    user: session.user,
                    start: date,
                    end: dateEnd,
                    start_time: startTime,
                    end_time: endTime,
                    repeat: repeat,
                    week_days: weekDays,
                    chrome: selected
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
                        collection: 'chrome_schedule',
                        body: {
                            schedule_info: info.id,
                            start: range.start,
                            end: range.end,
                            chrome: selected,
                            returned: false
                        }
                    }
                })
            })
        });

        fetch(`https://hook.us2.make.com/lt688h3jfsfllqn25i92p3yirvcfcd1g?id=${info.id}&collection=chrome`);

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
        const nsel: string[] = [];
        setObs('');

        (e.target as HTMLFormElement).reset();
    }

    return (
        <form onSubmit={(e) => submit(e)} className={`${styles.form}`}>
            {loading ? <LoaderPopup /> : ''}
            {success ? <SuccessPopup toggle={setSuccess} /> : ''}
            {error ? <ErrorPopup toggle={setError} code={errorCode} /> : ''}
            <h3>Agendar Chromebooks</h3>
            <DateComponent
                onChange={(dateStart, dateEnd, repeat, weekDays) => {
                    setDate(dateStart);
                    setDateEnd(dateEnd);
                    setRepeat(repeat);
                    setWeekDays(weekDays);
                }} />
            <div className={`${styles.time}`}>
                <label className={`${components.input}`}>
                    Empréstimo
                    <input type="time"
                        onChange={(e) => setStartTime(e.target.value)}
                        required />
                </label>
                <label className={`${components.input}`}>
                    Devolução
                    <input type="time"
                        onChange={(e) => setEndTime(e.target.value)}
                        required />
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
            <div className={`${styles.chromes}`}>
                <p>Selecione os Chromes para empréstimo</p>
                <MultiSelect name={"chromebooks"} items={chromesCheck} />
            </div>
            <input type="text" placeholder="Observação" className={`${styles.input}`} onChange={(e) => setObs(e.target.value ? e.target.value : "")} />
            <button className={`${styles.button}`} type="submit">Agendar</button>
        </form>
    )
}