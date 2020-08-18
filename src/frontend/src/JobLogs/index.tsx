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
  MenuItem,
  Grid,
  TextField,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { getUrl } from "../util/fetchUtils";
import { Load } from "../Load";
import { Log, JobLog } from "./JobLog";
import { PageTemplate } from "../PageTemplate";
import RefreshIcon from "@material-ui/icons/Refresh";
import { InfoMessage } from "../util/InfoMessage";
import { Job } from "../JobList";
import { Notification } from "../util/Notification";
import { ComponentContext } from "../ComponentProvider";

interface Props {
  jobId?: number;
}

interface FilteredLogs {
  selected: number;
  logs: Logs;
}

type Logs = Log[] | undefined;

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

export const JobLogs: React.FC<Props> = ({ jobId }) => {
  const components = React.useContext(ComponentContext);
  const classes = useStyles();
  const jobHasChanged = React.useRef(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [filteredLogs, dispatchFilteredLogs] = React.useReducer(logsReducer, {
    selected: jobId ? jobId : -1,
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

  const [jobs, getJobs] = useFetchMultiple<Job[]>(
    getUrl("/jobs"),
    undefined,
    handleLoadFailed
  );

  const handleReaload = () => {
    setLoadFailed(false);
    dispatchFilteredLogs({ type: "updateLogs", logs: undefined });
    getLogs();
    getJobs();
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

  useEffect(() => {
    // Check if jobs has changed
    jobHasChanged.current = true;
  }, [jobs]);

  useEffect(() => {
    if (jobHasChanged.current && jobs !== undefined) {
      // validate Selected id
      if (
        filteredLogs.selected !== -1 &&
        !jobs.some((j) => j.jobId === filteredLogs.selected)
      ) {
        // If Selected id is invalide, select -1
        dispatchFilteredLogs({
          type: "updateFilter",
          logs: logs,
          selected: -1,
        });
        setShowError(true);
      }

      jobHasChanged.current = false;
    }
  }, [jobs, logs, filteredLogs.selected]);

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
        condition={logs?.length === 0}
        message={{
          headline: "Willkommen bei ihrer Log Übersicht!",
          text: (
            <Typography align={"center"} color="textSecondary">
              Aktuell wurde noch kein Video generiert. <br />
              Sobald das erste Video generiert wurde können Sie hier die
              Log-Informationen sehen.
            </Typography>
          ),
          button: {
            text: "Startseite",
            onClick: () => components?.setCurrent("home"),
          },
        }}
      >
        <Load
          data={filteredLogs.logs && jobs}
          failed={{
            hasFailed: loadFailed,
            name: "Logs",
            onReload: handleReaload,
          }}
        >
          <Grid container className={classes.menuGrid}>
            <Grid item lg={6} md={3} xs>
              <TextField
                value={filteredLogs.selected}
                onChange={handleSelectJob}
                size="small"
                variant="outlined"
                select
                label="Jobs"
                className={classes.menuSelect}
              >
                <MenuItem value={-1}>Alle</MenuItem>
                {jobs?.map((job) => (
                  <MenuItem
                    key={job.jobId}
                    value={job.jobId}
                  >{`#${job.jobId}  ${job.jobName}`}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item container lg={6} md={9} xs justify={"flex-end"}>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  50,
                  { label: "Alle", value: -1 },
                ]}
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
                SelectProps={{ variant: "outlined" }}
              />
            </Grid>
          </Grid>
          <InfoMessage
            condition={filteredLogs.logs?.length === 0}
            message={{
              headline: "Todo",
              text: (
                <Typography align={"center"} color="textSecondary">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                </Typography>
              ),
            }}
          >
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
          </InfoMessage>
        </Load>
      </InfoMessage>
      <Notification
        open={showError}
        handleClose={() => setShowError(false)}
        message="Der ausgewählte Job ist nicht mehr Vorhanden!"
        severity="error"
      />
    </PageTemplate>
  );
};
