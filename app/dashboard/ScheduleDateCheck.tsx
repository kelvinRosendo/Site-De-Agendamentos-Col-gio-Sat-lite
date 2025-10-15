import { RecordModel } from "pocketbase";
import DateRange from "../DateRange";

export default function scheduleDateCheck(date: Date, dateEnd: Date, startTime: string, endTime: string, repeat: string, weekDays: string[], compSchedule: RecordModel, id: string, type: string): boolean {
    if (compSchedule.returned) {
        // Se o agendamento comparado foi devolvido, não há conflito
        return false;
    };

    let scheduledDays: DateRange[] = [];

    if (repeat == 'norepeat') {
        scheduledDays.push(new DateRange(date, Number(startTime.split(':')[0]) + 3, Number(startTime.split(':')[1]),
            Number(endTime.split(':')[0]) + 3, Number(endTime.split(':')[1])));
    }

    if (repeat == 'everyday') {
        for (let d = date; d <= dateEnd; d.setDate(d.getDate() + 1)) {
            scheduledDays.push(new DateRange(d, Number(startTime.split(':')[0]) + 3, Number(startTime.split(':')[1]),
                Number(endTime.split(':')[0]) + 3, Number(endTime.split(':')[1])));
        }
    }

    if (repeat == 'weekly') {
        for (let d = date; d <= dateEnd; d.setDate(d.getDate() + 1)) {
            if (weekDays.some(w => Number(w) == d.getDay())) scheduledDays.push(new DateRange(d, Number(startTime.split(':')[0]) + 3,
                Number(startTime.split(':')[1]), Number(endTime.split(':')[0]) + 3, Number(endTime.split(':')[1])));
        }
    }

    let commonItem = false;
    switch (type) {
        case 'chrome':
            commonItem = compSchedule.chrome.includes(id);
            break;
        case 'lab':
            commonItem = compSchedule.lab == id;
            break;
        case 'speaker':
            commonItem = compSchedule.speaker == id;
            break;
        default:
            console.error('Invalid type of Scheduling');
            break;
    }

    if (!commonItem && type != 'lab') return false;

    return scheduledDays.some(d => {
        const compStart = new Date(Date.parse(compSchedule.start) + 10800000);
        const compEnd = new Date(Date.parse(compSchedule.end) + 10800000);

        let allowed = d.end <= compStart || d.start >= compEnd;
        if (d.start >= compEnd && compSchedule.late) allowed = false;

        return !allowed;
    });
}
