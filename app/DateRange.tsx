export default class DateRange {
    start: Date;
    end: Date;

    constructor(date: Date, hourStart: number, minuteStart: number, hourEnd: number, minuteEnd: number) {
        this.start = new Date(date.setHours(hourStart - 3, minuteStart));
        this.end = new Date(date.setHours(hourEnd - 3, minuteEnd));
    }
}