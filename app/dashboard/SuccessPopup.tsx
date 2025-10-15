'use client';

import styles from "./popup.module.css";

export default function SuccessPopup({toggle}: {toggle: (b: boolean) => void}) {

    const click = () => {
        toggle(false);
        window.location.reload();
    }

    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <img src="/success.png" height={"50px"} alt="sucesso" />
                <p>Agendamento realizado!</p>
                <button className={`${styles.button}`} onClick={click} type="button">Continuar</button>
            </div>
        </div>
    )
}