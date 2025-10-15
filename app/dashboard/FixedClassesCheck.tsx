import { RecordModel } from "pocketbase";
import DateRange from "../DateRange";

export default function fixedClassCheck(date: Date, dateEnd: Date, startTime: string, endTime: string, repeat: string, weekDays: string[], fixed_classes: RecordModel[], id: string): boolean {
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

    return scheduledDays.some(d => {
        let occupied = false;

        fixed_classes?.forEach(f => {
            if (f.week_days.some((wd: string) => Number(wd) == d.start.getDay()) && id == f.lab) {
                let fStart = new Date(d.start);
                let fEnd = new Date(d.end);

                fStart = new Date(fStart.setUTCHours(Number(f.start.split(':')[0]) + 3, Number(f.start.split(':')[1])));
                fEnd = new Date(fEnd.setUTCHours(Number(f.end.split(':')[0]) + 3, Number(f.end.split(':')[1])));

                occupied = !(d.end <= fStart || d.start >= fEnd);
            }
        });

        return occupied;
    });
}
