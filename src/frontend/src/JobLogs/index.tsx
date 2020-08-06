import React from "react";
import { useStyles } from "./style";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { getUrl } from "../util/fetchUtils";
import { Load } from "../util/Load";
import { Log, JobLog } from "./JobLog";
import { GreyDivider } from "../JobCreate/GreyDivider";

export const JobLogs = () => {
  const classes = useStyles();
  const [logs, getLogs] = useFetchMultiple<Log[]>(getUrl("/logs"));

  return (
    <Container maxWidth={"md"} className={classes.margin}>
      <Paper variant="outlined" className={classes.paper}>
        <Typography variant={"h4"} className={classes.header}>
          Logs
        </Typography>
        <Load data={logs}>
          <Table>
            <TableBody>
              {logs?.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell className={classes.tableCell}>
                    <JobLog log={log} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Load>
      </Paper>
    </Container>
  );
};
