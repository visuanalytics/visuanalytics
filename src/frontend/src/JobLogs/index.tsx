import React from "react";
import { useStyles } from "./style";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  LabelDisplayedRowsArgs,
  Typography,
} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { getUrl } from "../util/fetchUtils";
import { Load } from "../Load";
import { Log, JobLog } from "./JobLog";
import { PageTemplate } from "../PageTemplate";
import RefreshIcon from "@material-ui/icons/Refresh";
import { InfoMessage } from "../util/InfoMessage";

export const JobLogs = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loadFailed, setLoadFailed] = React.useState(false);

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
          data={logs}
          failed={{
            hasFailed: loadFailed,
            name: "Logs",
            onReload: handleReaload,
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, { label: "All", value: -1 }]}
            component="div"
            count={logs?.length || 0}
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
                ? logs?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : logs
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
