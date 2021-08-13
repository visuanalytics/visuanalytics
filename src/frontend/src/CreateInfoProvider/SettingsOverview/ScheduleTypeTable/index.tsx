import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {Schedule} from "../../types";

interface ScheduleTypeTableProps {
    schedule: Schedule;
}

/**
 * Renders the table with information about the selected schedule times.
 * @param props The props passed by the parent.
 */
export const ScheduleTypeTable: React.FC<ScheduleTypeTableProps> = (props) => {

    /**
     * This method creates an object that is used as one row for the schedule time table
     * @param attribute The name for a part of the schedule object. Represents the first cell of a row.
     * @param value The value for the given attribute. Represents the second cell of a row.
     */
    const createTableRow = (attribute: string, value: string) => {
        return {attribute, value}
    }

    /**
     * Returns a, for the user readable, String-representation of the selected schedule type.
     * @param type The type String of the schedule object.
     */
    const getTypeString = (type: string) => {
        switch (type) {
            case "weekly":
                return "Wochentage";
            case "daily":
                return "Täglich";
            case "interval":
                return "Intervall";
            default:
                return "This should never happen."
        }
    }

    /**
     * Returns the string representation of a weekday.
     * @param weekdayNumber The numeric representation of a weekday. (Should range from 0 to 6)
     */
    const getWeekdayString = (weekdayNumber: number) => {
        switch (weekdayNumber) {
            case 0:
                return "Mo";
            case 1:
                return "Di";
            case 2:
                return "Mi";
            case 3:
                return "Do"
            case 4:
                return "Fr";
            case 5:
                return "Sa";
            case 6:
                return "So";
        }
    }

    /**
     * Returns a string containing all selected weekdays.
     * @param weekdayNumbers The array that holds the numeric representation of the weekdays which should be converted to a string.
     */
    const getWeekdaySelectionString = (weekdayNumbers: number[]) => {
        weekdayNumbers.sort();
        let weekdayStrings = [getWeekdayString(weekdayNumbers[0])];
        for(let i = 1; i < weekdayNumbers.length; i++) {
            weekdayStrings.push(getWeekdayString(weekdayNumbers[i]));
        }
        return weekdayStrings.join(", ");
    }

    /**
     * Generates a readable interval from the interval field of the schedule object.
     * @param selectedInterval The representation of an interval from the schedule object.
     */
    const getIntervalString = (selectedInterval: string) => {
        switch (selectedInterval) {
            case "minute":
                return "Jede Minute";
            case "quarter":
                return "Alle 15 Minuten";
            case "half":
                return "Alle 30 Minuten";
            case "threequarter":
                return "Alle 45 Minuten";
            case "hour":
                return "Jede Stunde";
            case "quartday":
                return "Alle 6 Stunden";
            case "halfday":
                return "Alle 12 Stunden";
        }
    }

    /**
     * Generates the needed table rows for the selected schedule type.
     * Only the needed rows are rendered for a given type.
     */
    const generateTableRows = () => {
        let rows = [createTableRow("Typ", getTypeString(props.schedule.type))];
        if(props.schedule.type === "daily") rows.push(createTableRow("Uhrzeit", props.schedule.time!));
        if(props.schedule.type === "weekly") rows.push(createTableRow("Ausgewählte Tage", getWeekdaySelectionString(props.schedule.weekdays)), createTableRow("Uhrzeit", props.schedule.time!));
        if(props.schedule.type === "interval") rows.push(createTableRow("Gewähltes Intervall", getIntervalString(props.schedule.interval)!));
        return rows;
    }

    return(
        <TableContainer component={Paper}>
            <Table aria-label="Historisierungszeiten">

                <TableBody>
                    {generateTableRows().map((row) => (
                        <TableRow key={row.attribute}>
                            <TableCell>{row.attribute}</TableCell>
                            <TableCell>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
