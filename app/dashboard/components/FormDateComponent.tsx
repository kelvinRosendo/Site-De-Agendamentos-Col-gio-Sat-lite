'use client';

import { ChangeEvent, KeyboardEventHandler, SetStateAction, useState } from "react";
import styles from "./components.module.css";
import { formatDate } from "date-fns";

export default function DateComponent({ onChange, onKeyDown, defaultValues }: { onChange?: (start: string, end: string, repeat: string, weekDays: string[]) => void; onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined, defaultValues?: {start?: string, end?: string, repeat?: string, weekdays?: string[]} }) {
    const [date, setDate] = useState(defaultValues && defaultValues.start ? defaultValues.start : '');
    const [dateEnd, setDateEnd] = useState(defaultValues && defaultValues.end ? defaultValues.end : '');
    const [repeat, setRepeat] = useState(defaultValues && defaultValues.repeat ? defaultValues.repeat : 'norepeat');

    const w: string[] = [];
    const [weekDays, setWeekDays] = useState(defaultValues && defaultValues.weekdays ? defaultValues.weekdays : w);

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const copy = weekDays.slice();
            copy.push(e.target.id);
            setWeekDays(copy);
            onChange?.(date, dateEnd, repeat, copy);
        } else {
            let copy = weekDays.slice();
            copy = remove(copy, e.target.id);
            setWeekDays(copy);
            onChange?.(date, dateEnd, repeat, copy);
        }
    }

    return (
        <div className={`${styles.form}`}>
            <label className={`${styles.input}`}>
                Data
                <input className={`${styles.input}`} defaultValue={defaultValues && defaultValues.start ? formatDate(new Date(Date.parse(defaultValues.start)), 'yyyy-MM-dd') : ''} type="date"
                    onChange={(e) => {
                        const splitValue = e.target.value.split('-');
                        const start = new Date(Number(splitValue[0]), (Number(splitValue[1]) - 1), Number(splitValue[2]), 12, 0);
                        setDate(start.toISOString());
                        onChange?.(start.toISOString(), dateEnd, repeat, weekDays);
                    }}
                    onKeyDown={onKeyDown}
                    required />
            </label>

            {repeat != "norepeat" ?
                <label className={`${styles.input}`}>
                    Data de término
                    <input className={`${styles.input}`} defaultValue={defaultValues && defaultValues.end ? formatDate(new Date(Date.parse(defaultValues.end)), 'yyyy-MM-dd') : ''} type="date"
                        onChange={(e) => {
                            const splitValue = e.target.value.split('-');
                            const end = new Date(Date.UTC(Number(splitValue[0]), Number(splitValue[1]) - 1, Number(splitValue[2]), 12, 0, 0, 0));
                            setDateEnd(end.toISOString());
                            onChange ? onChange(date, end.toISOString(), repeat, weekDays) : null;
                        }}
                        onKeyDown={onKeyDown}
                        required />
                </label>
                : ''}

            {repeat == "weekly" ?
                <label className={`${styles.weekdays}`}>
                    Dias da semana
                    <div className={`${styles.checkboxes}`}>
                        <label>
                            <span></span>
                            Domingo
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('0')} id="0"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Segunda-feira
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('1')} id="1"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Terça-feira
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('2')} id="2"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Quarta-feira
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('3')} id="3"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Quinta-feira
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('4')} id="4"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Sexta-feira
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('5')} id="5"
                                onChange={(e) => change(e)} />
                        </label>
                        <label>
                            <span></span>
                            Sábado
                            <input type="checkbox" defaultChecked={defaultValues?.weekdays?.includes('6')} id="6"
                                onChange={(e) => change(e)} />
                        </label>
                    </div>
                </label>
                : ''}

            <select onChange={(e) => {
                setRepeat(e.target.value);
                onChange ? onChange(date, dateEnd, e.target.value, weekDays) : null;
            }} className={`${styles.repeat}`} defaultValue={defaultValues?.repeat}>
                <option value={"norepeat"}>Não se repete</option>
                <option value={"everyday"}>Todos os dias</option>
                <option value={"weekly"}>Semanal</option>
            </select>
        </div>
    )
}

function remove(arr: any[], value: any) {
    var index = arr.indexOf(value);
    var newArr = arr.slice();
    if (index > -1) {
        newArr.splice(index, 1);
    }
    return newArr;
}