import {Weekday} from "../JobCreate";

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