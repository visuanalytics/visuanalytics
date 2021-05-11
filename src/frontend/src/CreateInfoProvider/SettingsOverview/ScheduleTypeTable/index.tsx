import React from "react";
import Button from "@material-ui/core/Button";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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

    const generateTableRows = () => {
        let rows = [createTableRow("Typ", getTypeString(props.schedule.type))];
        if(props.schedule.type === "daily") rows.push(createTableRow("Uhrzeit", props.schedule.time!));
        return rows;
    }

    return(
        <TableContainer component={Paper}>
            <Table aria-label="Historisierungszeiten">
                <TableHead>
                    <TableRow>
                        <TableCell>Attribut</TableCell>
                        <TableCell>Wert</TableCell>
                    </TableRow>
                </TableHead>
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
