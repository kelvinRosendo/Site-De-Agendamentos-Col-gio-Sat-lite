'use client';

import styles from "./components.module.css";

export default function Select({ items, onClick, required, defaultValue }: { items: { label: string; value: string; disabled?: boolean | undefined }[], 
    onClick?: (value: string | undefined) => void, required?: boolean, defaultValue?: string }) {
    return (
        <select className={`${styles.repeat}`} onChange={(e) => {onClick? onClick(e.target.value) : null}} required={required} defaultValue={defaultValue}>
            <option value="">Selecione</option>
            {items?.map((item: { label: string, value: string, disabled?: boolean | undefined }) => {
                    return (
                        <option key={item.value} value={item.value} disabled={item.disabled ? item.disabled : false}>
                            {item.label}
                        </option>
                    )
                })}
        </select>
    )
}