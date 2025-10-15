import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import ScheduleCategory from './ScheduleCategory';
import Return from '@/app/Return';
import styles from './page.module.css';
import { getServerSession } from 'next-auth';
import { createServerPB } from '@/pocketbase/core';

export default async function Me() {
    const session = await getServerSession();
    const pb = createServerPB();

    let [
        chromeInfo,
        chromeSchedule,
        labInfo,
        labSchedule,
    ] = await Promise.all([
        pb.collection('chrome_schedule_info').getFullList({
            expand: `chrome,grade,class,week_days`
        }),
        pb.collection('chrome_schedule').getFullList({
            expand: `chrome`
        }),
        pb.collection('lab_schedule_info').getFullList({
            expand: `lab,grade,class,week_days`
        }),
        pb.collection('lab_schedule').getFullList({
            expand: `lab`
        })
    ]);

    chromeInfo = chromeInfo.filter(i => i.user?.email == (session?.user != null ? (session?.user.email || "") : "") && chromeSchedule.some(s => s.schedule_info == i.id && !s.returned));
    labInfo = labInfo.filter(i => i.user?.email == (session?.user != null ? (session?.user.email || "") : "") && labSchedule.some(s => s.schedule_info == i.id && !s.returned));

    return (
        <div className={`${styles.container}`}>
            <Return />
            <h2>Suas solicitações</h2>
            <p>Você possui {chromeInfo.length + labInfo.length} solicitações ativas.</p>
            {chromeInfo.length > 0 ? <ScheduleCategory type='chrome' schedules={chromeInfo} /> : ""}
            {labInfo.length > 0 ? <ScheduleCategory type='lab' schedules={labInfo} /> : ""}
        </div>
    )
}