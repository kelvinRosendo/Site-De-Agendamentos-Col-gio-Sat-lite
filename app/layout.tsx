import "./globals.css";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import styles from "./layout.module.css";
import { headers } from "next/headers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Serviços TI Satélite",
  description: "Website para o uso dos diversos serviços administrados pela equipe de TI do Colégio Satélite",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://colegiosatelite.com.br/wp-content/uploads/2021/05/icon-1.png" sizes="192x192" />
        <link rel="icon" href="https://colegiosatelite.com.br/wp-content/uploads/2021/05/icon-1.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="https://colegiosatelite.com.br/wp-content/uploads/2021/05/icon-1.png" />
      </head>
      <body className={`${montserrat.className}`}>
        {pathname != 'dashboard/view' ?
          <>
            <header className={`${styles.header}`}>
              <div className={`${styles.title}`}>
                <img src="/logo.png" height={"40px"} alt="logo" />
                <h1>Serviços do TI</h1>
              </div>
              <nav className={`${styles.nav}`}>
                <ul>
                  <li><Link href={"/dashboard"}>Início</Link></li>
                  <li><Link href={"/dashboard/me"}>Acompanhar Solicitações</Link></li>
                  <li><Link href={"/dashboard/admin"}>Administrador</Link></li>
                </ul>
              </nav>
            </header>
            <main className={`${styles.main}`}>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </main>
            <footer className={`${styles.footer}`}>
              <p>Site desenvolvido pela equipe de TI</p>
              <p>
                Email para suporte: <a target="_blank" href="https://mail.google.com/a/colegiosatelite.com.br/mail/?extsrc=mailto&url=mailto%3Agustavo.martinez%40colegiosatelite.com.br%3Fsubject%3DSuporte%20para%20o%20website%20de%20Serviços">gustavo.martinez@colegiosatelite.com.br</a>
              </p>
            </footer>
          </> :
          <>
            {children}
          </>
        }
      </body>
    </html>
  );
}