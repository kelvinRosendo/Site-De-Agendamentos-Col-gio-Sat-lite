'use client';

import { ChangeEvent } from "react";
import MultiSelectItem from "./MultiSelectItemComponent";
import styles from "./components.module.css";

export default function MultiSelect({ name, items, onChange }: {
    name: string;
    items: { label: string; value: string; disabled: boolean, defaultChecked?: boolean }[];
    onChange?: (values: string[] | undefined) => void
}) {
    const selectAll = () => {
        document.getElementById('checkboxes')?.childNodes.forEach(item => {
            var trigger = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "checked"
            )!.set;
            trigger?.call((item as HTMLElement).querySelector('input'), !((item as HTMLElement).querySelector('input') as HTMLInputElement).disabled);
            const evt = new Event('change', {
                bubbles: true
            });
            (item as HTMLElement).querySelector('input')!.dispatchEvent(evt);
        });

        let sel: string[] = [];

        document.getElementById('checkboxes')?.querySelectorAll('input').forEach((e: HTMLInputElement) => {
            sel.push(e.id);
        });

        onChange ? onChange(sel) : null;
    }

    const unselectAll = () => {
        document.getElementById('checkboxes')?.childNodes.forEach(item => ((item as HTMLElement).querySelector('input') as HTMLInputElement).disabled ? null : ((item as HTMLElement).querySelector('input') as HTMLInputElement).checked = false);

        onChange ? onChange([]) : null;
    }

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        const elements: string[] = [];
        document.getElementsByName(name).forEach(c => (c as HTMLInputElement).checked ? elements.push(c.id) : null);
        onChange ? onChange(elements) : null;
    }

    return (
        <div className={`${styles.multiselect}`}>
            <div className={`${styles.buttons}`}>
                <button className={`${styles.button}`} type="button" onClick={selectAll}>Selecionar Todos</button>
                <button className={`${styles.button}`} type="button" onClick={unselectAll}>Remover Todos</button>
            </div>
            <div id="checkboxes" className={`${styles.checkboxes}`}>
                {items?.map((item: { label: string, value: string, disabled: boolean, defaultChecked?: boolean }) => {
                    return (
                        <label key={item.value}>
                            <span></span>
                            {item.label}
                            <MultiSelectItem name={name} value={item.value} disabled={item.disabled} defaultChecked={item.defaultChecked} onChange={(e) => change(e)} />
                        </label>
                    )
                })}
            </div>
        </div>
    )
}