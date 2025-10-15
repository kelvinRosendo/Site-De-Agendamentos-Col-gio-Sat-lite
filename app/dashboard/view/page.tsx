import styles from './page.module.css';
import Clickup from './Clickup';
import Rotator from './Rotator';
import Schedules from './Schedules';
import Realtime from '../Realtime';
import { createServerPB } from '@/pocketbase/core';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function View() {
    const pb = createServerPB();

    if ((await pb.collection("admins").getFullList({ filter: `email = '${(await getServerSession())?.user?.email || ""}'` })).length <= 0) {
        redirect('https://aliceapp.ia.br/api/auth/error?error=AccessDenied'); 
    }

    // Schedule data
    let chromes;
    let labs;
    let chromeScheduleInfo;
    let chromeSchedule;
    let labScheduleInfo;
    let labSchedule;

    // Clickup data
    let tasks;
    let diary;

    try {
        chromes = await pb.collection('chrome').getFullList();
        const labs = await pb.collection('lab').getFullList();

        chromeScheduleInfo = await pb.collection('chrome_schedule_info').getFullList({
            expand: `chrome,grade,class,week_days`
        });

        chromeSchedule = await pb.collection('chrome_schedule').getFullList({
            expand: `chrome,schedule_info,schedule_info.grade,schedule_info.class,schedule_info.week_days,schedule_info`
        });

        labScheduleInfo = await pb.collection('lab_schedule_info').getFullList({
            expand: `lab,grade,class,week_days`
        });

        labSchedule = await pb.collection('lab_schedule').getFullList();

    } catch (error) {
        console.log('Error getting Schedule data!', error);
    }

    const url = 'https://api.clickup.com/api/v2/list/901105559393/task';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.clickuptkn!
        }
    };

    const url2 = 'https://api.clickup.com/api/v2/list/901110299584/task';

    await fetch(url, options).then(res => res.json()).then(json => tasks = json).catch(err => {
        console.log('Error fetching tasks', err);
    });
    await fetch(url2, options).then(res => res.json()).then(json => diary = json).catch(err => {
        console.log('Error fetching diaries', err);
    });

    return (
        <>
            <div style={{
                backgroundColor: "#021421",
                position: "absolute",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw"
            }}>
            <Rotator className={`${styles.page}`} time={60000}>
                <Schedules data={{ chromes, labs, speakers: [], chromeScheduleInfo, chromeSchedule, labScheduleInfo, labSchedule, speakerScheduleInfo: [], speakerSchedule: [] }} />
                <Clickup data={{ tasks, diary }} />
            </Rotator>
            </div>
            <Realtime />
        </>
    )
}