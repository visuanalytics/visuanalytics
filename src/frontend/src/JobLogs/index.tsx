import React, { useEffect } from "react";
import { useStyles } from "./style";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  LabelDisplayedRowsArgs,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { getUrl } from "../util/fetchUtils";
import { Load } from "../Load";
import { Log, JobLog } from "./JobLog";
import { PageTemplate } from "../PageTemplate";
import RefreshIcon from "@material-ui/icons/Refresh";
import { InfoMessage } from "../util/InfoMessage";

type Logs = Log[] | undefined;

interface FilteredLogs {
  selected: number;
  logs: Logs;
}

type FilteredLogsAction =
  | { type: "updateLogs"; logs: Logs }
  | { type: "updateFilter"; logs: Logs; selected: number };

const filterLogs = (selected: number, logs: Logs) => {
  return selected === -1
    ? logs
    : logs?.filter((value) => value.jobId === selected);
};

const logsReducer = (
  state: FilteredLogs,
  action: FilteredLogsAction
): FilteredLogs => {
  switch (action.type) {
    case "updateLogs":
      return {
        selected: state.selected,
        logs: filterLogs(state.selected, action.logs),
      };
    case "updateFilter":
      return {
        selected: action.selected,
        logs: filterLogs(action.selected, action.logs),
      };
  }
};

export const JobLogs = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [filteredLogs, dispatchFilteredLogs] = React.useReducer(logsReducer, {
    selected: -1,
    logs: undefined,
  });

  const handleLoadFailed = React.useCallback(() => {
    setLoadFailed(true);
  }, [setLoadFailed]);

  const [logs, getLogs] = useFetchMultiple<Log[]>(
    getUrl("/logs"),
    undefined,
    handleLoadFailed
  );

  const handleReaload = () => {
    setLoadFailed(false);
    getLogs();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDisplayRows = ({ from, to, count }: LabelDisplayedRowsArgs) => {
    return `${from}-${to === -1 ? count : to} von ${count}`;
  };

  const handleSelectJob = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatchFilteredLogs({
      type: "updateFilter",
      selected: event.target.value as number,
      logs: logs,
    });
  };

  useEffect(() => {
    dispatchFilteredLogs({ type: "updateLogs", logs: logs });
  }, [logs]);

  return (
    <PageTemplate
      heading="Logs"
      action={{
        title: "Neuladen",
        Icon: <RefreshIcon fontSize="large" />,
        onClick: handleReaload,
      }}
      hintContent={
        <div>
          <Typography variant="h5" gutterBottom>
            Logs
          </Typography>
          <Typography gutterBottom>TODO</Typography>
        </div>
      }
    >
      <InfoMessage
        condition={filteredLogs.logs?.length === 0}
        message={{
          headline: "Willkommen bei ihrer Log Übersicht!",
          text: (
            <Typography align={"center"} color="textSecondary">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et
            </Typography>
          ),
          button: {
            text: "TODO",
          },
        }}
      >
        <Load
          data={filteredLogs.logs}
          failed={{
            hasFailed: loadFailed,
            name: "Logs",
            onReload: handleReaload,
          }}
        >
          <Select value={filteredLogs.selected} onChange={handleSelectJob}>
            <MenuItem value={-1}>Alle</MenuItem>
            <MenuItem value={5}>Job 5</MenuItem>
            <MenuItem value={6}>Job 6</MenuItem>
          </Select>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, { label: "Alle", value: -1 }]}
            component="div"
            count={filteredLogs.logs?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="Einträge pro Seite:"
            labelDisplayedRows={handleDisplayRows}
            nextIconButtonText="Nächste Seite"
            backIconButtonText="Vorherige Seite"
          />
          <Table>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredLogs.logs?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredLogs.logs
              )?.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell className={classes.tableCell}>
                    <JobLog log={log} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Load>
      </InfoMessage>
    </PageTemplate>
  );
};
