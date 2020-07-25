import { format } from "date-fns"

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

