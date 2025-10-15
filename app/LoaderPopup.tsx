import styles from "./loading.module.css";

export default function LoaderPopup() {
    return (
        <div className={`${styles.popup}`}>
            <div className={`${styles.message}`}>
                <p>Carregando...</p>
                <span className={`${styles.loader}`}></span>
            </div>
        </div>
    )
}