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


