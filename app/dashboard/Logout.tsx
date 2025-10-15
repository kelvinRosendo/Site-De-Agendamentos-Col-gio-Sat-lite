'use client'
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Logout() {
    const handleLogout = async () => {
        await signOut();
        redirect('/login');
    }

    return (
        <button onClick={() => handleLogout()}>Logout</button>
    )
}