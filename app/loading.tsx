import LoaderPopup from "./LoaderPopup";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={`${styles.main}`}>
      <LoaderPopup />
    </main>
  )
}