import Login from "./Login";
import styles from "./page.module.css";
import Cookies from "js-cookie";

export default async function Home() {

    return (
        <div className={`${styles.login}`}>
                <h2>Faça Login</h2>
                <p>Utilize sua conta institucional do Colégio Satélite!</p>
                <Login/>
            </div>
    )
}