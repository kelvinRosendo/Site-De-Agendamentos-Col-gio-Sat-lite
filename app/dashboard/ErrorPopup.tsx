'use client';

import styles from "./popup.module.css";

export default function ErrorPopup({toggle, code}: {toggle: (b: boolean) => void; code: number}) {
    let message = 'Não foi possível identificar a causa, por favor contate o suporte.';

    switch (code) {
        case 1:
            message = 'Data do agendamento inválida.';
            break;
        case 2:
            message = 'Selecione um horário válido.';
            break;
        case 3:
            message = 'Selecione ao menos um Chromebook.';
            break;
        case 4:
            message = 'Para a organização do TI, agende com 1 hora de antecedência.';
            break;
        case 5:
            message = 'Para a organização do laboratório, agende com 1 dia de antecedência.';
            break;
        default: 
            break;
    }

    const click = () => {
        toggle(false);
    }

    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <img src="/error.png" height={"50px"} alt="erro" />
                <p>Houve um erro ao realizar o agendamento!</p>
                <p>{message}</p>
                <button className={`${styles.button}`} onClick={click} type="button">Continuar</button>
            </div>
        </div>
    )
}