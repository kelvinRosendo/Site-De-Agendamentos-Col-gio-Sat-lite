'use client';

import { cloneElement, ReactElement, useEffect, useState } from 'react';
import styles from './rotator.module.css';

interface RotatorProps {
    children: React.ReactNode[];
    time: number;
    className?: string | undefined;
}

export default function Rotator({ children, time, className }: RotatorProps) {
    const [index, setIndex] = useState(1);
    const [transition, setTransition] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => prevIndex >= children.length - 1 ? 0 : prevIndex + 1);
            setTransition(true);
            setTimeout(() => setTransition(false), 1000);
        }, time);
        return () => clearInterval(interval);
    }, [children.length]);

    return (
        <div className={className}>
            {children.map((child, i) => {
                if (!child || typeof child !== 'object' || !('props' in child)) return child;

                const existingClassName = (child as any).props.className || '';
                const rotationClasses = [
                    styles.item,
                    index === i && styles.shown,
                    index !== i && !transition && styles.hide
                ].filter(Boolean).join(' ');

                return cloneElement((child as any), {
                    className: `${existingClassName != 'undefined' ? existingClassName : ''} ${rotationClasses}`,
                    key: i
                });
            })}
        </div>
    );
}