import {Schedule} from "../CreateInfoProvider/types";
import {getWeekdayString} from "../CreateInfoProvider/helpermethods";

/**
 * Calculates a string that displays the interval scheme of a given schedule
 */
export const getIntervalDisplay = (schedule: Schedule) => {
    //check for weekly
    if (schedule.type === "weekly") {
        if (schedule.weekdays !== undefined && schedule.weekdays.length !== 0) {
            //check if every day is selected
            if(schedule.weekdays.length === 7) {
                return "24h";
            }
            const weekdayNumbers = schedule.weekdays.slice();
            weekdayNumbers.sort();
            let weekdayStrings = [getWeekdayString(weekdayNumbers[0])];
            for(let i = 1; i < weekdayNumbers.length; i++) {
                weekdayStrings.push(getWeekdayString(weekdayNumbers[i]));
            }
            return "Wochentage ("  + weekdayStrings.join(", ") + ")";
        }
    }
    //check for daily
    else if (schedule.type === "daily") {
        return "24h"
    }
    //check for interval
    else if (schedule.type === "interval") {
        switch (schedule.interval) {
            case "minute": {
                return "1m";
            }
            case "quarter": {
                return "15m";
            }
            case "half": {
                return "30m";
            }
            case "threequarter": {
                return "45m";
            }
            case "hour": {
                return "1h";
            }
            case "quartday": {
                return "6h";
            }
            case "halfday": {
                return "12h"
            }
        }
    }
    return ""
}
