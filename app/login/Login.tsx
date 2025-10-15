'use client';
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {

    return (
        <>
            <button onClick={() => signIn("google", {
                callbackUrl: "/dashboard"
            })}>Login</button>
        </>
    )
}