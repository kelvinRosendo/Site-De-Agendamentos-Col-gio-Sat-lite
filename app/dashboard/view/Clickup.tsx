import styles from './clickup.module.css';
import Scrolling from './Scrolling';
import { format } from 'date-fns';

export default function Clickup({ data }: { data: any }) {
    const todoId = "sc901105559393_BJjZ8bHb";
    const inProgressId = "sc901105559393_KMPJFKlq";

    const todo = data.tasks.tasks.filter((t: { status: { id: string; }; }) => t.status.id == todoId).length;
    const inProgress = data.tasks.tasks.filter((t: { status: { id: string; }; }) => t.status.id == inProgressId).length;

    const tasks = data.tasks.tasks.filter((t: { status: { id: string; }; }) => t.status.id == inProgressId || t.status.id == todoId);

    return (
        <div className={`${styles.container}`}>
            <aside className={`${styles.aside}`}>
                <h1 className={`${styles.title}`}>Status das Tarefas</h1>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((todo / tasks.length) * 100)}%`,
                        "--value": `${(todo / tasks.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{todo}/{tasks.length}</span></span>
                    <p>A Fazer</p>
                </article>

                <article className={`${styles.chartContainer}`}>
                    <span className={`${styles.pieChart}`} style={{
                        "--max": `${100 - ((inProgress / tasks.length) * 100)}%`,
                        "--value": `${(inProgress / tasks.length) * 100}%`
                    } as React.CSSProperties}><span className={`${styles.innerChart}`}>{inProgress}/{tasks.length}</span></span>
                    <p>Em Andamento</p>
                </article>

                <article className={`${styles.article}`}>
                    <div className={`${styles.header}`}>
                        <h2>Diário de Bordo</h2>
                    </div>

                    <div className={`${styles.body}`}>
                        <Scrolling className={`${styles.scroll}`} time={1500} id='diary'>
                            {data.diary.tasks.filter((t: any) => t.name.includes(format(new Date(), 'dd/MM/yyyy')) || t.name.includes(format(new Date().setDate(new Date().getDate() - 1), 'dd/MM/yyyy'))).map((task: any) => {
                                return (
                                    <article key={task.id} className={`${styles.article}`}>
                                        <div className={`${styles.header}`}>
                                            <p>{task.name}</p>
                                        </div>

                                        <div className={`${styles.body} ${styles.description}`}>
                                            <ul className={`${styles.items}`}>
                                                {task.description.split('\n').map((t: string) => <li key={t}>{t}</li>)}
                                            </ul>
                                        </div>
                                    </article>
                                )
                            })}
                        </Scrolling>
                    </div>
                </article>
            </aside>

            <main className={`${styles.main}`}>
                <h1 className={`${styles.title}`}>Tarefas</h1>

                <div className={`${styles.kanban}`}>
                    <article className={`${styles.article}`}>
                        <div className={`${styles.header}`}>
                            <h2>A Fazer</h2>
                        </div>

                        <div className={`${styles.body}`}>
                            <Scrolling className={`${styles.scroll}`} time={1500} id='todo'>
                                {tasks.filter((t: any) => t.status.id == todoId).sort((a: any, b: any) => Number(a.priority.id) - Number(b.priority.id)).map((task: any) => {
                                    let priority = '';

                                    switch (task.priority.id) {
                                        case '1':
                                            priority = 'Urgente';
                                            break;
                                        case '2':
                                            priority = 'Alta';
                                            break;
                                        case '3':
                                            priority = 'Normal';
                                            break;
                                        case '4':
                                            priority = 'Baixa';
                                            break;
                                        default:
                                            priority = 'Prioridade Inválida';
                                            break;
                                    }

                                    return (
                                        <article key={task.id} className={`${styles.article}`}>
                                            <div className={`${styles.header}`}>
                                                <p>{task.name}</p>
                                            </div>

                                            <div className={`${styles.body}`}>
                                                <p className={`${styles.priority}`} style={{
                                                    color: `${task.priority.color}`
                                                }}><span className={`${styles.bold}`}>Prioridade: </span>{priority}</p>
                                                
                                                {task.due_date && <p className={`${styles.duedate}`}><span className={`${styles.bold}`}>Data Final: </span>{format(Number(task.due_date), 'dd/MM/yyyy')}</p>}
                                                
                                                {task.assignees.length > 0 ? <div className={`${styles.assignees}`}>
                                                    <p className={`${styles.bold}`}>Responsáveis:</p>
                                                    <ul className={`${styles.items}`}>
                                                        {task.assignees.map((a: any) => <li key={a.id}>{a.username}</li>)}
                                                    </ul>
                                                </div> : ''}

                                                {task.description !== '' ? <div className={`${styles.description}`}>
                                                    <p className={`${styles.bold}`}>Descrição:</p>
                                                    <ul className={`${styles.items}`}>
                                                        {task.description.split('\n').map((t: string) => <li key={t}>{t}</li>)}
                                                    </ul>
                                                </div> : ''}
                                            </div>
                                        </article>
                                    )
                                })}
                            </Scrolling>
                        </div>
                    </article>

                    <article className={`${styles.article}`}>
                        <div className={`${styles.header}`}>
                            <h2>Em Andamento</h2>
                        </div>

                        <div className={`${styles.body}`}>
                        <Scrolling className={`${styles.scroll}`} time={1500} id='inprogress'>
                                {tasks.filter((t: any) => t.status.id == inProgressId).sort((a: any, b: any) => Number(a.priority.id) - Number(b.priority.id)).map((task: any) => {
                                    let priority = '';

                                    switch (task.priority.id) {
                                        case '1':
                                            priority = 'Urgente';
                                            break;
                                        case '2':
                                            priority = 'Alta';
                                            break;
                                        case '3':
                                            priority = 'Normal';
                                            break;
                                        case '4':
                                            priority = 'Baixa';
                                            break;
                                        default:
                                            priority = 'Prioridade Inválida';
                                            break;
                                    }

                                    return (
                                        <article key={task.id} className={`${styles.article}`}>
                                            <div className={`${styles.header}`}>
                                                <p>{task.name}</p>
                                            </div>

                                            <div className={`${styles.body}`}>
                                                <p className={`${styles.priority}`} style={{
                                                    color: `${task.priority.color}`
                                                }}><span className={`${styles.bold}`}>Prioridade: </span>{priority}</p>
                                                
                                                {task.due_date && <p className={`${styles.duedate}`}><span className={`${styles.bold}`}>Data Final: </span>{format(Number(task.due_date), 'dd/MM/yyyy')}</p>}
                                                
                                                {task.assignees.length > 0 ? <div className={`${styles.assignees}`}>
                                                    <p className={`${styles.bold}`}>Responsáveis:</p>
                                                    <ul className={`${styles.items}`}>
                                                        {task.assignees.map((a: any) => <li key={a.id}>{a.username}</li>)}
                                                    </ul>
                                                </div> : ''}

                                                {task.description !== '' ? <div className={`${styles.description}`}>
                                                    <p className={`${styles.bold}`}>Descrição:</p>
                                                    <ul className={`${styles.items}`}>
                                                        {task.description.split('\n').map((t: string) => <li key={t}>{t}</li>)}
                                                    </ul>
                                                </div> : ''}
                                            </div>
                                        </article>
                                    )
                                })}
                            </Scrolling>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    )
}