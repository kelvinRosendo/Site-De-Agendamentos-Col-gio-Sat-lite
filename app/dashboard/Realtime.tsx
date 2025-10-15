'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Realtime({ interval = 20000 }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            router.refresh();
        }, interval);
        return () => clearInterval(timer);
    }, [router, interval]);

    return (
        <></>
    );
}