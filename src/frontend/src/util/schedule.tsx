import { format, parse, isPast, addDays, formatDistanceToNowStrict, addMinutes } from "date-fns"
import { de } from "date-fns/locale";


export type Schedule = DailySchedule | WeeklySchedule | DateSchedule | IntervalSchedule

export enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

export type TimeInterval = "minute" | "quarter" | "half" | "threequarter" | "hour" | "quartday" | "halfday"


interface DailySchedule {
    type: "daily",
    time: Date
}

interface IntervalSchedule {
    type: "interval"
    interval: TimeInterval
    nextExecution: Date
}

interface WeeklySchedule {
    type: "weekly",
    time: Date,
    weekdays: Weekday[]
}

interface DateSchedule {
    type: "onDate",
    time: Date,
    date: Date
}


export const withFormattedDates = (schedule: Schedule) => {
    const type = schedule.type;

    if (schedule.type === "daily") {
        return {
            type: type,
            time: schedule.time.toLocaleTimeString("de-DE").slice(0, -3)
        }
    }
    if (schedule.type === "onDate") {
        return {
            type: type,
            time: schedule.time.toLocaleTimeString("de-DE").slice(0, -3),
            date: format(schedule.date, "yyyy-MM-dd")
        };
    }
    if (schedule.type === "weekly") {
        return {
            type: type,
            time: schedule.time.toLocaleTimeString("de-DE").slice(0, -3),
            weekdays: schedule.weekdays
        };
    }
    if (schedule.type === "interval") {
        return {
            type: type,
            timeInterval: schedule.interval
        };
    }
}

export const fromFormattedDates = (fSchedule: any): Schedule => {
    const type = fSchedule.type;
    const partial = {
        type: fSchedule.type,
        time: parse(fSchedule.time, "H:m", new Date())
    }
    if (fSchedule.type === "daily") {
        return {
            type: type,
            time: parse(fSchedule.time, "H:m", new Date())
        }
    }
    if (fSchedule.type === "onDate") {
        return {
            type: type,
            time: parse(fSchedule.time, "H:m", new Date()),
            date: (parse(`${fSchedule.time}-${fSchedule.date}`, "H:m-y-MM-dd", new Date()))
        }
    }
    if (fSchedule.type === "weekly") {
        return {
            type: type,
            time: parse(fSchedule.time, "H:m", new Date()),
            weekdays: fSchedule.weekdays
        };
    }
    if (fSchedule.type === "interval") {
        let nextExecution;
        if (fSchedule.nextExecution === null) {
            nextExecution = addInterval(new Date(), fSchedule.interval)
        } else {
            let nextExecutionStr = String(fSchedule.nextExecution).replace(" ", "-").substr(0, 19);
            nextExecution = parse(nextExecutionStr, "yyyy-MM-dd-HH:mm:ss", new Date())
        }
        return {
            type: type,
            interval: fSchedule.interval,
            nextExecution: nextExecution
        }
    }
    return partial;
}

const getNextJobDate = (schedule: Schedule) => {
    if (!validateSchedule(schedule)) {
        return null;
    }
    if (schedule.type === "interval") {
        return schedule.nextExecution;
    }

    const fToday = format(new Date(), "yyyy-MM-dd");
    const fTime = schedule.time.toLocaleTimeString("de-DE").slice(0, -3);
    const combined = parse(`${fTime}-${fToday}`, "H:m-y-MM-dd", new Date());
    switch (schedule.type) {
        case "daily":
            if (isPast(combined)) {
                return addDays(combined, 1);
            }
            return combined;
        case "weekly":
            const n = (combined.getDay() + 6) % 7;
            const ds = schedule.weekdays.map(w => {
                const d = addDays(combined, (w + 7 - n) % 7);
                if (isPast(d)) {
                    return addDays(d, 7);
                }
                return d;
            });
            return new Date(Math.min.apply(null, ds.map(d => d.getTime())));
        case "onDate":
            const fDate = format(schedule.date, "yyyy-MM-dd");
            return parse(`${fTime}-${fDate}`, "H:m-y-MM-dd", new Date());
    }
}

export const showSchedule = (schedule: Schedule) => {
    switch (schedule.type) {
        case "daily":
            return "täglich, " + format(schedule.time, "HH:mm", { locale: de }) + " Uhr";
        case "onDate":
            return format(schedule.date, "dd.MM.yyyy") + ", " + format(schedule.time, "HH:mm", { locale: de }) + " Uhr";
        case "weekly":
            if (schedule.weekdays.length === 0) {
                return "wöchentlich: kein Wochentag ausgewählt";
            }
            const weekdays = schedule.weekdays.map(w => getWeekdayLabel(w)).join(", ");
            return "wöchentlich: " + weekdays + ", " + format(schedule.time, "HH:mm", { locale: de }) + " Uhr";
        case "interval":
            switch (schedule.interval) {
                case "minute":
                    return "jede Minute";
                case "quarter":
                    return "alle 15 Minuten";
                case "half":
                    return "alle 30 Minuten";
                case "threequarter":
                    return "alle 45 Minuten";
                case "hour":
                    return "jede Stunde";
                case "quartday":
                    return "alle 6 Stunden";
                case "halfday":
                    return "alle 12 Stunden";
            }
    }
}

export const getWeekdayLabel = (day: Weekday) => {
    switch (day) {
        case Weekday.MONDAY:
            return "Mo";
        case Weekday.TUESDAY:
            return "Di";
        case Weekday.WEDNESDAY:
            return "Mi"
        case Weekday.THURSDAY:
            return "Do";
        case Weekday.FRIDAY:
            return "Fr";
        case Weekday.SATURDAY:
            return "Sa";
        case Weekday.SUNDAY:
            return "So"
    }
}

export const getIntervalLabel = (interval: TimeInterval) => {
    switch (interval) {
        case "minute":
            return "1min";
        case "quarter":
            return "15min";
        case "half":
            return "30min"
        case "threequarter":
            return "45min";
        case "hour":
            return "1std";
        case "quartday":
            return "6std";
        case "halfday":
            return "12std"
    }
}

export const showTimeToNextDate = (schedule: Schedule) => {
    const date = getNextJobDate(schedule);
    if (date === null || date === undefined) {
        return "-";
    }
    return formatDistanceToNowStrict(date, { locale: de, addSuffix: true });
}

export const validateSchedule = (schedule: Schedule) => {
    return schedule.type !== "weekly" || (schedule.type === "weekly" && schedule.weekdays.length > 0);
}

const addInterval = (date: Date, interval: TimeInterval) => {
    let minutes;
    switch (interval) {
        case "minute":
            minutes = 1;
            break;
        case "quarter":
            minutes = 15;
            break;
        case "half":
            minutes = 30;
            break;
        case "threequarter":
            minutes = 45;
            break;
        case "hour":
            minutes = 60
            break;
        case "quartday":
            minutes = 360;
            break;
        case "halfday":
            minutes = 720;
            break;
    }
    return addMinutes(date, minutes)
}
