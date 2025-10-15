
import AdminServices from './AdminServices';
import Return from '@/app/Return';
import styles from "./page.module.css";
import { createServerPB } from '@/pocketbase/core';
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export default async function Admin() {
    const pb = createServerPB();

    if ((await pb.collection("admins").getFullList({ filter: `email = '${(await getServerSession())?.user?.email || ""}'` })).length <= 0) {
        redirect('https://aliceapp.ia.br/api/auth/error?error=AccessDenied'); 
    }

    const [
        chromes,
        labs,
        chromeScheduleInfo,
        chromeSchedule,
        labScheduleInfo,
        labSchedule
    ] = await Promise.all([
        pb.collection('chrome').getFullList(),
        pb.collection('lab').getFullList(),
        pb.collection('chrome_schedule_info').getFullList({
            expand: `chrome,grade,class,week_days`
        }),
        pb.collection('chrome_schedule').getFullList(),
        pb.collection('lab_schedule_info').getFullList({
            expand: `lab,grade,class,week_days`
        }),
        pb.collection('lab_schedule').getFullList()
    ]);

    return (
        <div className={`${styles.page}`}>
            <Return />
            <h2>Painel de Administrador</h2>
            <AdminServices data={{ chromes, labs, speakers: [], chromeScheduleInfo: chromeScheduleInfo, chromeSchedule: chromeSchedule, labScheduleInfo: labScheduleInfo, labSchedule: labSchedule, speakerScheduleInfo: [], speakerSchedule: [] }} />
        </div>
    )
}