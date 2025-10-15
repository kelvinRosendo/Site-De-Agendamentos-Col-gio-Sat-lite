import { cookies, headers } from "next/headers";
import Pocketbase from "pocketbase";
import styles from "./layout.module.css";
import Logout from "./Logout";
import Realtime from "./Realtime";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) return <div>
    <p>Você precisa fazer login para ter acesso à essa página!</p>
    <a href="/login">Ir para a página de login</a>
  </div>;

  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  
  return (
    <div className={`${styles.container} --font-montserrat`}>
      {pathname != '/dashboard/view' && <div className={`${styles.logout}`}>
        <p>Olá, {session.user?.name}</p>
        <Logout />
        {/* <Realtime /> */}
      </div>}
      {children}
    </div>
  )
}