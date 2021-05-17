import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import { Schedule } from "../..";

interface ScheduleTypeTableProps {
    schedule: Schedule;
}

export const ScheduleTypeTable: React.FC<ScheduleTypeTableProps> = (props) => {

    const createTableRow = (attribute: string, value: string) => {
        return {attribute, value}
    }

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

    const getWeekdaySelectionString = (weekdayNumbers: number[]) => {
        weekdayNumbers.sort();
        let weekdayStrings = [getWeekdayString(weekdayNumbers[0])];
        for(let i = 1; i < weekdayNumbers.length; i++) {
            weekdayStrings.push(getWeekdayString(weekdayNumbers[i]));
        }
        return weekdayStrings.join(", ");
    }

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
