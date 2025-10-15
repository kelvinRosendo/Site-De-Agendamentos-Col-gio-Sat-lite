'use client';

import { useEffect, useRef, useState } from "react";

interface ScrollingProps {
    children: React.ReactNode[];
    time: number;
    id: string;
    className?: string | undefined;
}

export default function Scrolling({ children, time, id, className }: ScrollingProps) {
    useEffect(() => {
        const interval = setInterval(() => {
            document.getElementById(id)?.scroll({
                behavior: "smooth",
                left: document.getElementById(id)?.scrollLeft! + 1 + document.getElementById(id)?.clientWidth! >= document.getElementById(id)?.scrollWidth! ? 0 : document.getElementById(id)?.scrollLeft! + 160,
                top: document.getElementById(id)?.scrollTop! + 10 + document.getElementById(id)?.clientHeight! >= document.getElementById(id)?.scrollHeight! ? 0 : document.getElementById(id)?.scrollTop! + 30
            });
        }, time);
        return () => clearInterval(interval);  
    });

    return (
        <div className={className} id={id}>
            {children}
        </div>
    )
}