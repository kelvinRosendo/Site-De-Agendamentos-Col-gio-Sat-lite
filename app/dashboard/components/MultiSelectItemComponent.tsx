import { ChangeEvent, useState } from "react";

export default function MultiSelectItem({ name, value, disabled, onChange, defaultChecked }: { name: string; value: string; disabled: boolean; onChange?: (e: ChangeEvent<HTMLInputElement>) => void, defaultChecked?: boolean }) {
    return (
        <div>
            {disabled ? <input type="checkbox" checked={false || false} name={name} id={value} disabled={true} /> : <input type="checkbox" defaultChecked={defaultChecked} name={name} id={value} disabled={false} />}
        </div>
    );
}
