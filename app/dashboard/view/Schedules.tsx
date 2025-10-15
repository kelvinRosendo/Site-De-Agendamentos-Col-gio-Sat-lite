import { RecordModel } from 'pocketbase';
import styles from './schedules.module.css';
import { format } from 'date-fns';
import Scrolling from './Scrolling';

export default function Schedules({ data }: { data: any }) {

    const available = data.chromes.filter((cur: RecordModel, index: number, arr: RecordModel[]) => {
        return !cur.occupied && data.chromeSchedule.every((s: RecordModel) => !s.chrome.includes(cur.id) || (new Date(Date.parse(s.start) + 10800000) > new Date() || new Date(Date.parse(s.end) + 10800000) < new Date() || s.late)); 
    }).length;
    const using = data.chromes.filter((cur: RecordModel, index: number, arr: RecordModel[]) => {
        return !cur.occupied && data.chromeSchedule.some((s: RecordModel) => s.chrome.includes(cur.id) && new Date(Date.parse(s.start)  + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) > new Date() && !s.returned);
    }).length;
    const returning = data.chromes.filter((cur: RecordModel, index: number, arr: RecordModel[]) => {
        return !cur.occupied && data.chromeSchedule.some((s: RecordModel) => s.chrome.includes(cur.id) && new Date(Date.parse(s.end) + 10800000) < new Date() && !s.returned && !s.late);
    }).length;
    const late = data.chromes.filter((cur: RecordModel, index: number, arr: RecordModel[]) => {
        return !cur.occupied && data.chromeSchedule.some((s: RecordModel) => s.chrome.includes(cur.id) && !s.returned && s.late);
    }).length;

    const chromesUsing = data.chromes.filter((chrome: RecordModel) => !chrome.occupied && data.chromeSchedule.some((s: RecordModel) => s.chrome.includes(chrome.id) && new Date(Date.parse(s.start)  + 10800000) <= new Date() && new Date(Date.parse(s.end) + 10800000) > new Date() && !s.returned));

    return (
        <div className={`${styles.container}`}>

            <aside className={`${styles.aside}`}>
                <h1 className={`${styles.title}`}>Status dos Chromebooks</h1>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((available / data.chromes.length) * 100)}%`,
                        "--value": `${(available / data.chromes.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{available}/{data.chromes.length}</span></span>
                    <p>Disponível</p>
                </article>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((using / data.chromes.length) * 100)}%`,
                        "--value": `${(using / data.chromes.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{using}/{data.chromes.length}</span></span>
                    <p>Em Uso</p>
                </article>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((returning / data.chromes.length) * 100)}%`,
                        "--value": `${(returning / data.chromes.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{returning}/{data.chromes.length}</span></span>
                    <p>Aguardando Devolução</p>
                </article>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((late / data.chromes.length) * 100)}%`,
                        "--value": `${(late / data.chromes.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{late}/{data.chromes.length}</span></span>
                    <p>Atrasado</p>
                </article>
            </aside>

            <main className={`${styles.main}`}>

                <h1 className={`${styles.title}`}>Agendamentos</h1>

                <article className={`${styles.chromes} ${styles.article}`}>
                    <div className={`${styles.header}`}>
                        <h2>Chromes Em Uso</h2>
                    </div>

                    <div className={`${styles.body}`}>
                        <Scrolling className={`${styles.chromesContainer}`} time={1500} id='chromes'>
                            {chromesUsing.map((chrome: RecordModel) => <div key={chrome.id} className={`${styles.chrome} ${styles.schedule}`}>{chrome.label}</div>)}
                        </Scrolling>
                    </div>
                </article>


                <article className={`${styles.schedules} ${styles.article}`}>

                    <div className={`${styles.header}`}>
                        <h2>Agendamentos de hoje</h2>
                    </div>

                    <div className={`${styles.body}`}>
                        <Scrolling className={`${styles.schedulesContainer}`} time={1000} id='schedules'>
                        {data.chromeSchedule.map((schedule: RecordModel) => {
                                if (format(new Date(Date.parse(schedule.start) + 10800000), 'dd/MM/yyyy') == format(new Date(new Date()), 'dd/MM/yyyy') && !schedule.returned) return (
                                    <div key={schedule.id} className={`${styles.schedule}`}>
                                        <div className={`${styles.header}`}>
                                            <h3>{`${schedule.expand?.schedule_info.user.name}${schedule.expand?.schedule_info.obs ? `: "${schedule.expand?.schedule_info.obs}"` : ''} | ${schedule.expand?.schedule_info.expand?.grade.label + (schedule.expand?.schedule_info.expand?.class ? ` ${schedule.expand?.schedule_info.expand?.class.label}` : '')}, das ${schedule.expand?.schedule_info.start_time} até ${schedule.expand?.schedule_info.end_time}`}</h3>
                                        </div>

                                        <div className={`${styles.body}`}>
                                            {schedule.expand?.chrome.map((chrome: RecordModel) => <span key={chrome.id} className={`${styles.chrome}`}>{chrome.label}</span>)}
                                        </div>
                                    </div>
                                )

                                if (schedule.late && !schedule.returned) return (
                                    <div key={schedule.id} className={`${styles.schedule}`}>
                                        <div className={`${styles.header} ${styles.late}`}>
                                            <h3>{`${schedule.expand?.schedule_info.user.name}${schedule.expand?.schedule_info.obs ? `: "${schedule.expand?.schedule_info.obs}"` : ''} | ${schedule.expand?.schedule_info.expand?.grade.label + (schedule.expand?.schedule_info.expand?.class ? ` ${schedule.expand?.schedule_info.expand?.class.label}` : '')}, em atraso desde ${format(new Date(Date.parse(schedule.end)), 'dd/MM/yyyy')}!`}</h3>
                                        </div>

                                        <div className={`${styles.body}`}>
                                            {schedule.expand?.chrome.map((chrome: RecordModel) => <span key={chrome.id} className={`${styles.chrome}`}>{chrome.label}</span>)}
                                        </div>
                                    </div>
                                )
                            })}
                        </Scrolling>
                    </div>

                </article>

            </main>

        </div>
    )
}