'use client';
import { FormEvent, useState } from "react";
import styles from "./edit.module.css";
import DateComponent from "@/app/dashboard/components/FormDateComponent";
import Select from "@/app/dashboard/components/SelectComponent";
import MultiSelect from "@/app/dashboard/components/MultiSelectComponent";
import scheduleDateCheck from "@/app/dashboard/ScheduleDateCheck";
import { RecordModel } from "pocketbase";
import Pocketbase from "pocketbase";
import Cookies from "js-cookie";
import validDate from "@/app/dashboard/ValidDate";
import DateRange from "@/app/DateRange";
import { useRouter } from "next/navigation";
import services from "@/app/dashboard/serviceTypes";
import LoaderPopup from "@/app/LoaderPopup";
import ErrorPopup from "@/app/dashboard/ErrorPopup";

export default function Edit({ type, id, data, info }: {
    type: string, id: string, data: { grades: RecordModel[], classes: RecordModel[], chromes: RecordModel[], labs: RecordModel[], speakers: RecordModel[], chromeSchedule: RecordModel[], labSchedule: RecordModel[], speakerSchedule: RecordModel[] },
    info: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, class: string, obs?: string, speaker?: string, lab?: string, chromes?: string[], weekdays?: string[] }
}) {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState(0);

    return (
        <div>
            {loading ? <LoaderPopup /> : ''}
            {error ? <ErrorPopup toggle={setError} code={errorCode} /> : ''}
            <div className={`${styles.popup} ${edit ? styles.shown : ''}`}>
                {type == services.chrome ? <Chromes id={id} setEdit={setEdit} setLoading={setLoading} setError={setError} setErrorCode={setErrorCode} info={{
                    start: info.start,
                    end: info.end,
                    start_time: info.start_time,
                    end_time: info.end_time,
                    repeat: info.repeat,
                    weekdays: info.weekdays,
                    grade: info.grade,
                    class: info.class,
                    chromes: info.chromes!,
                    obs: info.obs
                }} data={{
                    grades: data.grades,
                    classes: data.classes,
                    chromes: data.chromes,
                    chromeSchedule: data.chromeSchedule
                }} /> : ''}
                {type == services.lab ? <Lab id={id} setEdit={setEdit} setLoading={setLoading} setError={setError} setErrorCode={setErrorCode} info={{
                    start: info.start,
                    end: info.end,
                    start_time: info.start_time,
                    end_time: info.end_time,
                    repeat: info.repeat,
                    weekdays: info.weekdays,
                    grade: info.grade,
                    class: info.class,
                    lab: info.lab!,
                    obs: info.obs
                }} data={{
                    grades: data.grades,
                    classes: data.classes,
                    labs: data.labs,
                    labSchedule: data.labSchedule
                }} /> : ''}
                {type == services.speaker ? <Speaker id={id} setEdit={setEdit} setLoading={setLoading} setError={setError} setErrorCode={setErrorCode} info={{
                    start: info.start,
                    end: info.end,
                    start_time: info.start_time,
                    end_time: info.end_time,
                    repeat: info.repeat,
                    weekdays: info.weekdays,
                    grade: info.grade,
                    class: info.class,
                    speaker: info.speaker!,
                    obs: info.obs
                }} data={{
                    grades: data.grades,
                    classes: data.classes,
                    speakers: data.speakers,
                    speakerSchedule: data.speakerSchedule
                }} /> : ''}
            </div>
            <button className={`${styles.button}`} onClick={() => setEdit(true)}>Editar</button>
        </div>
    )
}

export function Chromes({ id, setEdit, setLoading, setError, setErrorCode, info, data }: { id: string, setEdit: (edit: boolean) => void, setLoading: (loading: boolean) => void, setError: (error: boolean) => void, setErrorCode: (code: number) => void, info: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, class: string, chromes: string[], obs?: string, weekdays?: string[] }, data: { grades: RecordModel[], classes: RecordModel[], chromes: RecordModel[], chromeSchedule: RecordModel[] } }) {
    const router = useRouter();
    const [date, setDate] = useState(info.start);
    const [dateEnd, setDateEnd] = useState(info.end);
    const [repeat, setRepeat] = useState(info.repeat);
    const [weekDays, setWeekDays] = useState(info.weekdays);
    const [startTime, setStartTime] = useState(info.start_time);
    const [endTime, setEndTime] = useState(info.end_time);
    const [grade, setGrade] = useState(info.grade);
    const [gradeClass, setGradeClass] = useState(info.class);
    const [chromes, setChromes] = useState(info.chromes);
    const [obs, setObs] = useState(info.obs);

    let chromesCheck: { label: any; value: string; disabled: boolean; }[] = [];

    data.chromes.forEach(c => {
        const item = {
            label: c.label,
            value: c.id,
            disabled: c.occupied || data.chromeSchedule.some(s => s.schedule_info != id && scheduleDateCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays!, s, c.id, 'chrome')) || (startTime == '' || endTime == ''),
            defaultChecked: chromes?.includes(c.id.toString())
        }
        chromesCheck.push(item);
    });

    const cancel = () => {
        setEdit(false);
        setDate(info.start);
        setDateEnd(info.end);
        setRepeat(info.repeat);
        setWeekDays(info.weekdays);
        setStartTime(info.start_time);
        setEndTime(info.end_time);
        setGrade(info.grade);
        setGradeClass(info.class);
        setChromes(info.chromes);
        setObs(info.obs);
        location.reload();
    }

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
        const end = new Date(Date.parse(dateEnd));

        if (selected.length <= 0) {
            setErrorCode(3);
            setError(true);
            return;
        }

        const start_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${startTime}`));
        const end_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${endTime}`));

        if (start_time >= end_time) {
            setErrorCode(2);
            setError(true);
            return;
        }

        setLoading(true);

        updateSchedule(services.chrome, id, data.chromeSchedule, {
            grade: info.grade,
            gradeClass: info.class,
            obs: info.obs,
            start: info.start,
            end: info.end,
            start_time: info.start_time,
            end_time: info.end_time,
            repeat: info.repeat,
            weekdays: info.weekdays,
            chromes: info.chromes
        }, {
            grade: grade,
            gradeClass: gradeClass,
            obs: obs,
            start: date,
            end: dateEnd,
            start_time: startTime,
            end_time: endTime,
            repeat: repeat,
            weekdays: weekDays,
            chrome: selected
        });

        setLoading(false);

        (e.target as HTMLFormElement).reset();
    }


    return (
        <div className={`${styles.message}`}>
            <p>Edite essa solicitação</p>
            <form onSubmit={(e) => submit(e)} className={`${styles.form}`}>
                <DateComponent
                    onChange={(dateStart, dateEnd, repeat, weekDays) => {
                        setDate(dateStart);
                        setDateEnd(dateEnd);
                        setRepeat(repeat);
                        setWeekDays(weekDays);
                    }} defaultValues={{
                        start: info.start,
                        end: info.end,
                        repeat: info.repeat,
                        weekdays: info.weekdays
                    }} />
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Empréstimo
                        <input type="time"
                            onChange={(e) => setStartTime(e.target.value)}
                            required defaultValue={startTime} />
                    </label>
                    <label className={`${styles.input}`}>
                        Devolução
                        <input type="time"
                            onChange={(e) => setEndTime(e.target.value)}
                            required defaultValue={endTime} />
                    </label>
                </div>
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Série
                        <Select items={data.grades.map(g => {
                            return {
                                label: g.label,
                                value: g.id,
                            }
                        })} onClick={(value) => { value && data.grades.some(g => g.id == value) ? setGrade(value) : setGrade('') }} required={true} defaultValue={grade} />
                    </label>
                    {grade != '' && data.grades.find(g => g.id == grade)!.classes.length > 0 ? <label className={`${styles.input}`}>
                        Turma
                        <Select items={data.grades.find(g => g.id == grade)?.expand?.classes.map((c: any) => {
                            return {
                                label: c.label,
                                value: c.id
                            };
                        })} onClick={(value) => value ? setGradeClass(value) : setGradeClass('')} required={true} defaultValue={gradeClass} />
                    </label> : null}
                </div>
                <div className={`${styles.chromes}`}>
                    <p>Selecione os Chromes para empréstimo</p>
                    <MultiSelect name={"chromebooks"} items={chromesCheck} />
                </div>
                <input type="text" placeholder="Observação" defaultValue={obs} className={`${styles.obs}`} onChange={(e) => setObs(e.target.value ? e.target.value : "")} />
                <button className={`${styles.button}`} type="submit">Salvar</button>
                <button className={`${styles.button}`} onClick={cancel} type="button">Cancelar</button>
            </form>
        </div>
    )
}

export function Lab({ id, setEdit, setLoading, setError, setErrorCode, info, data }: { id: string, setEdit: (edit: boolean) => void, setLoading: (loading: boolean) => void, setError: (error: boolean) => void, setErrorCode: (code: number) => void, info: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, class: string, lab: string, obs?: string, weekdays?: string[] }, data: { grades: RecordModel[], classes: RecordModel[], labs: RecordModel[], labSchedule: RecordModel[] } }) {
    const router = useRouter();
    const [date, setDate] = useState(info.start);
    const [dateEnd, setDateEnd] = useState(info.end);
    const [repeat, setRepeat] = useState(info.repeat);
    const [weekDays, setWeekDays] = useState(info.weekdays);
    const [startTime, setStartTime] = useState(info.start_time);
    const [endTime, setEndTime] = useState(info.end_time);
    const [grade, setGrade] = useState(info.grade);
    const [gradeClass, setGradeClass] = useState(info.class);
    const [lab, setLab] = useState(info.lab);
    const [obs, setObs] = useState(info.obs);

    let labsSelect: { label: any; value: string; disabled: boolean; }[] = [];

    data.labs.forEach(l => {
        const item = {
            label: l.label,
            value: l.id,
            disabled: l.occupied || data.labSchedule.some(s => s.schedule_info != id && scheduleDateCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays!, s, l.id, 'lab')) || (startTime == '' || endTime == '')
        }
        labsSelect.push(item);
    });

    const cancel = () => {
        setEdit(false);
        setDate(info.start);
        setDateEnd(info.end);
        setRepeat(info.repeat);
        setWeekDays(info.weekdays);
        setStartTime(info.start_time);
        setEndTime(info.end_time);
        setGrade(info.grade);
        setGradeClass(info.class);
        setLab(info.lab);
        setObs(info.obs);
        location.reload();
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validDate(new Date(Date.parse(date)), repeat, new Date(Date.parse(dateEnd)), weekDays)) {
            setErrorCode(1);
            setError(true);
            return;
        };

        const start = new Date(Date.parse(date));
        const end = new Date(Date.parse(dateEnd));

        const start_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${startTime}`));
        const end_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${endTime}`));

        if (start_time >= end_time) {
            setErrorCode(2);
            setError(true);
            return;
        }

        setLoading(true);

        updateSchedule(services.lab, id, data.labSchedule, {
            grade: info.grade,
            gradeClass: info.class,
            obs: info.obs,
            start: info.start,
            end: info.end,
            start_time: info.start_time,
            end_time: info.end_time,
            repeat: info.repeat,
            weekdays: info.weekdays,
            lab: info.lab
        }, {
            grade: grade,
            gradeClass: gradeClass,
            obs: obs,
            start: date,
            end: dateEnd,
            start_time: startTime,
            end_time: endTime,
            repeat: repeat,
            weekdays: weekDays,
            lab: lab
        });

        setLoading(false);

        (e.target as HTMLFormElement).reset();
    }


    return (
        <div className={`${styles.message}`}>
            <p>Edite essa solicitação</p>
            <form onSubmit={(e) => submit(e)} className={`${styles.form}`}>
                <DateComponent
                    onChange={(dateStart, dateEnd, repeat, weekDays) => {
                        setDate(dateStart);
                        setDateEnd(dateEnd);
                        setRepeat(repeat);
                        setWeekDays(weekDays);
                    }} defaultValues={{
                        start: info.start,
                        end: info.end,
                        repeat: info.repeat,
                        weekdays: info.weekdays
                    }} />
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Empréstimo
                        <input type="time"
                            onChange={(e) => setStartTime(e.target.value)}
                            required defaultValue={startTime} />
                    </label>
                    <label className={`${styles.input}`}>
                        Devolução
                        <input type="time"
                            onChange={(e) => setEndTime(e.target.value)}
                            required defaultValue={endTime} />
                    </label>
                </div>
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Série
                        <Select items={data.grades.map(g => {
                            return {
                                label: g.label,
                                value: g.id,
                            }
                        })} onClick={(value) => { value && data.grades.some(g => g.id == value) ? setGrade(value) : setGrade('') }} required={true} defaultValue={grade} />
                    </label>
                    {grade != '' && data.grades.find(g => g.id == grade)!.classes.length > 0 ? <label className={`${styles.input}`}>
                        Turma
                        <Select items={data.grades.find(g => g.id == grade)?.expand?.classes.map((c: any) => {
                            return {
                                label: c.label,
                                value: c.id
                            };
                        })} onClick={(value) => value ? setGradeClass(value) : setGradeClass('')} required={true} defaultValue={gradeClass} />
                    </label> : null}
                </div>
                <label className={`${styles.input}`}>
                    Laboratório
                    <Select items={labsSelect} onClick={(value) => { value ? setLab(value) : setLab('') }} defaultValue={lab} />
                </label>
                <input type="text" placeholder="Observação" defaultValue={obs} className={`${styles.obs}`} onChange={(e) => setObs(e.target.value ? e.target.value : "")} />
                <button className={`${styles.button}`} type="submit">Salvar</button>
                <button className={`${styles.button}`} onClick={cancel} type="button">Cancelar</button>
            </form>
        </div>
    )
}

export function Speaker({ id, setEdit, setLoading, setError, setErrorCode, info, data }: { id: string, setEdit: (edit: boolean) => void, setLoading: (loading: boolean) => void, setError: (error: boolean) => void, setErrorCode: (code: number) => void, info: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, class: string, speaker: string, obs?: string, weekdays?: string[] }, data: { grades: RecordModel[], classes: RecordModel[], speakers: RecordModel[], speakerSchedule: RecordModel[] } }) {
    const router = useRouter();
    const [date, setDate] = useState(info.start);
    const [dateEnd, setDateEnd] = useState(info.end);
    const [repeat, setRepeat] = useState(info.repeat);
    const [weekDays, setWeekDays] = useState(info.weekdays);
    const [startTime, setStartTime] = useState(info.start_time);
    const [endTime, setEndTime] = useState(info.end_time);
    const [grade, setGrade] = useState(info.grade);
    const [gradeClass, setGradeClass] = useState(info.class);
    const [speaker, setSpeaker] = useState(info.speaker);
    const [obs, setObs] = useState(info.obs);

    let speakerSelect: { label: any; value: string; disabled: boolean; }[] = [];

    data.speakers.forEach(l => {
        const item = {
            label: l.label,
            value: l.id,
            disabled: l.occupied || data.speakerSchedule.some(s => s.schedule_info != id && scheduleDateCheck(new Date(Date.parse(date)), new Date(Date.parse(dateEnd)), startTime, endTime, repeat, weekDays!, s, l.id, 'speaker')) || (startTime == '' || endTime == '')
        }
        speakerSelect.push(item);
    });

    const cancel = () => {
        setEdit(false);
        setDate(info.start);
        setDateEnd(info.end);
        setRepeat(info.repeat);
        setWeekDays(info.weekdays);
        setStartTime(info.start_time);
        setEndTime(info.end_time);
        setGrade(info.grade);
        setGradeClass(info.class);
        setSpeaker(info.speaker);
        setObs(info.obs);
        location.reload();
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validDate(new Date(Date.parse(date)), repeat, new Date(Date.parse(dateEnd)), weekDays)) {
            setErrorCode(1);
            setError(true);
            return;
        };

        const start = new Date(Date.parse(date));
        const end = new Date(Date.parse(dateEnd));

        const start_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${startTime}`));
        const end_time = new Date(Date.parse(`${start.getFullYear()}-${start.getMonth().toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}T${endTime}`));

        if (start_time >= end_time) {
            setErrorCode(2);
            setError(true);
            return;
        }

        setLoading(true);

        updateSchedule(services.speaker, id, data.speakerSchedule, {
            grade: info.grade,
            gradeClass: info.class,
            obs: info.obs,
            start: info.start,
            end: info.end,
            start_time: info.start_time,
            end_time: info.end_time,
            repeat: info.repeat,
            weekdays: info.weekdays,
            speaker: info.speaker
        }, {
            grade: grade,
            gradeClass: gradeClass,
            obs: obs,
            start: date,
            end: dateEnd,
            start_time: startTime,
            end_time: endTime,
            repeat: repeat,
            weekdays: weekDays,
            speaker: speaker
        });

        setLoading(false);

        (e.target as HTMLFormElement).reset();
    }


    return (
        <div className={`${styles.message}`}>
            <p>Edite essa solicitação</p>
            <form onSubmit={(e) => submit(e)} className={`${styles.form}`}>
                <DateComponent
                    onChange={(dateStart, dateEnd, repeat, weekDays) => {
                        setDate(dateStart);
                        setDateEnd(dateEnd);
                        setRepeat(repeat);
                        setWeekDays(weekDays);
                    }} defaultValues={{
                        start: info.start,
                        end: info.end,
                        repeat: info.repeat,
                        weekdays: info.weekdays
                    }} />
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Empréstimo
                        <input type="time"
                            onChange={(e) => setStartTime(e.target.value)}
                            required defaultValue={startTime} />
                    </label>
                    <label className={`${styles.input}`}>
                        Devolução
                        <input type="time"
                            onChange={(e) => setEndTime(e.target.value)}
                            required defaultValue={endTime} />
                    </label>
                </div>
                <div className={`${styles.time}`}>
                    <label className={`${styles.input}`}>
                        Série
                        <Select items={data.grades.map(g => {
                            return {
                                label: g.label,
                                value: g.id,
                            }
                        })} onClick={(value) => { value && data.grades.some(g => g.id == value) ? setGrade(value) : setGrade('') }} required={true} defaultValue={grade} />
                    </label>
                    {grade != '' && data.grades.find(g => g.id == grade)!.classes.length > 0 ? <label className={`${styles.input}`}>
                        Turma
                        <Select items={data.grades.find(g => g.id == grade)?.expand?.classes.map((c: any) => {
                            return {
                                label: c.label,
                                value: c.id
                            };
                        })} onClick={(value) => value ? setGradeClass(value) : setGradeClass('')} required={true} defaultValue={gradeClass} />
                    </label> : null}
                </div>
                <label className={`${styles.input}`}>
                    Caixa de Som
                    <Select items={speakerSelect} onClick={(value) => { value ? setSpeaker(value) : setSpeaker('') }} defaultValue={speaker} />
                </label>
                {data.speakers.some(s => s.id == speaker) && data.speakers.find(s => s.id == speaker)!.obs && data.speakers.find(s => s.id == speaker)!.obs != '' ? <p>{data.speakers.find(s => s.id == speaker)!.obs}</p> : ''}
                <input type="text" placeholder="Observação" defaultValue={obs} className={`${styles.obs}`} onChange={(e) => setObs(e.target.value ? e.target.value : "")} />
                <button className={`${styles.button}`} type="submit">Salvar</button>
                <button className={`${styles.button}`} onClick={cancel} type="button">Cancelar</button>
            </form>
        </div>
    )
}

async function updateSchedule(
    type: string, id: string, schedules: RecordModel[],
    info: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, gradeClass: string, obs?: string, speaker?: string, lab?: string, chromes?: string[], weekdays?: string[] },
    newInfo: { start: string, end: string, start_time: string, end_time: string, repeat: string, grade: string, gradeClass: string, obs?: string, speaker?: string, lab?: string, chrome?: string[], weekdays?: string[] }
) {
    try {
        await fetch("/api/db/update", {
            method: "POST",
            body: JSON.stringify({
                collection: `${type}_schedule_info`,
                id: id,
                body: {
                    grade: newInfo.grade,
                    class: newInfo.gradeClass,
                    obs: newInfo.obs,
                    start: newInfo.start,
                    end: newInfo.end,
                    start_time: newInfo.start_time,
                    end_time: newInfo.end_time,
                    repeat: newInfo.repeat,
                    week_days: newInfo.weekdays,
                    chrome: newInfo.chrome,
                    lab: newInfo.lab,
                    speaker: newInfo.speaker
                }
            })
        });
    } catch (error) {
        console.log('Error updating schedule info!', error);
    }

    if (info.start != newInfo.start || info.end != newInfo.end || info.start_time != newInfo.start_time || info.end_time != newInfo.end_time ||
        info.repeat !== newInfo.repeat || info.weekdays != newInfo.weekdays || info.chromes != newInfo.chrome) {
        const toDelete = schedules.filter(s => s.schedule_info == id);
        if (toDelete.length > 0) {
            await fetch("/api/db/batch/delete", {
                method: "POST",
                body: JSON.stringify({
                    items: toDelete.map(s => { return { id: s.id, collection: `${type}_schedule` } })
                })
            });
        }

        const start = new Date(Date.parse(newInfo.start));
        const end = new Date(Date.parse(newInfo.end) + 86400000);
        let scheduledDays: DateRange[] = [];

        if (newInfo.repeat == 'norepeat') {
            scheduledDays.push(new DateRange(start, Number(newInfo.start_time.split(':')[0]), Number(newInfo.start_time.split(':')[1]),
                Number(newInfo.end_time.split(':')[0]), Number(newInfo.end_time.split(':')[1])));
        }

        if (newInfo.repeat == 'everyday') {
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                scheduledDays.push(new DateRange(d, Number(newInfo.start_time.split(':')[0]), Number(newInfo.start_time.split(':')[1]),
                    Number(newInfo.end_time.split(':')[0]), Number(newInfo.end_time.split(':')[1])));
            }
        }

        if (newInfo.repeat == 'weekly') {
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                if (newInfo.weekdays?.some(w => Number(w) == d.getDay())) scheduledDays.push(new DateRange(d, Number(newInfo.start_time.split(':')[0]),
                    Number(newInfo.start_time.split(':')[1]), Number(newInfo.end_time.split(':')[0]), Number(newInfo.end_time.split(':')[1])));
            }
        }

        await fetch("/api/db/batch/create", {
            method: "POST",
            body: JSON.stringify({
                items: scheduledDays.map(range => {
                    if (type == services.chrome) return {
                        collection: 'chrome_schedule',
                        body: {
                            schedule_info: id,
                            start: range.start,
                            end: range.end,
                            chrome: newInfo.chrome,
                            returned: false
                        }
                    }

                    if (type == services.chrome) return {
                        collection: 'lab_schedule',
                        body: {
                            schedule_info: id,
                            start: range.start,
                            end: range.end,
                            lab: newInfo.lab,
                            returned: false
                        }
                    }

                    if (type == services.speaker) return {
                        collection: 'speaker_schedule',
                        body: {
                            schedule_info: id,
                            start: range.start,
                            end: range.end,
                            speaker: newInfo.speaker,
                            returned: false
                        }
                    }
                })
            })
        });
    }

    location.reload();
}