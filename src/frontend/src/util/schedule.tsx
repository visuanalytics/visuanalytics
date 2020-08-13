import { format, parse, isPast, addDays, formatDistanceToNowStrict } from "date-fns"
import { de } from "date-fns/locale";


export type Schedule = DailySchedule | WeeklySchedule | DateSchedule

export enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

interface DailySchedule extends ISchedule {
    type: "daily"
}

interface WeeklySchedule extends ISchedule {
    type: "weekly",
    weekdays: Weekday[]
}

interface DateSchedule extends ISchedule {
    type: "onDate",
    date: Date
}

interface ISchedule {
    time: Date
}

export const withFormattedDates = (schedule: Schedule) => {
    const partial = {
        type: schedule.type,
        time: schedule.time.toLocaleTimeString("de-DE").slice(0, -3)
    }
    if (schedule.type === "onDate") {
        return { ...partial, date: format(schedule.date, "yyyy-MM-dd") };
    }
    if (schedule.type === "weekly") {
        return { ...partial, weekdays: schedule.weekdays };
    }
    return partial;
}

export const fromFormattedDates = (fSchedule: any): Schedule => {
    const partial = {
        type: fSchedule.type,
        time: parse(fSchedule.time, "H:m", new Date())
    }
    if (fSchedule.type === "onDate") {
        return { ...partial, date: (parse(`${fSchedule.time}-${fSchedule.date}`, "H:m-y-MM-dd", new Date())) }
    }
    if (fSchedule.type === "weekly") {
        return { ...partial, weekdays: fSchedule.weekdays };
    }
    return partial;
}

const getNextJobDate = (schedule: Schedule) => {
    if (!validateSchedule(schedule)) {
        return null;
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
    if (schedule.type === "daily") {
        return "täglich, " + format(schedule.time, "HH:mm", {locale: de}) + " Uhr";
    } else if (schedule.type === "onDate") {
        return format(schedule.date, "dd.MM.yyyy") + ", " + format(schedule.time, "HH:mm", {locale: de}) + " Uhr";
    } else if (schedule.type === "weekly") {
        if (schedule.weekdays.length === 0) {
            return "wöchentlich: kein Wochentag ausgewählt";
        }
        const weekdays = schedule.weekdays.map(w => getWeekdayLabel(w)).join(", ");
        return "wöchentlich: " + weekdays + ", " + format(schedule.time, "HH:mm", {locale: de}) + " Uhr";
    }
}

export const getWeekdayLabel = (day: Weekday) => {
    switch (day) {
        case Weekday.MONDAY: return "Mo";
        case Weekday.TUESDAY: return "Di";
        case Weekday.WEDNESDAY: return "Mi"
        case Weekday.THURSDAY: return "Do";
        case Weekday.FRIDAY: return "Fr";
        case Weekday.SATURDAY: return "Sa";
        case Weekday.SUNDAY: return "So"
    }
}

export const showTimeToNextDate = (schedule: Schedule) => {
    const date = getNextJobDate(schedule);
    if (date === null) {
        return "-";
    }
    return formatDistanceToNowStrict(date, { locale: de, addSuffix: true });
}

export const validateSchedule = (schedule: Schedule) => {
    return schedule.type !== "weekly" || (schedule.type === "weekly" && schedule.weekdays.length > 0);
}