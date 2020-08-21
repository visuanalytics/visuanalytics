import React from "react";
import { useStyles } from "../style";
import Backdrop from "@material-ui/core/Backdrop";
import {
    Dialog,
    Grid,
    Tooltip,
    InputBase,
    TextField,
    Paper,
    Typography,
    DialogContent,
    DialogTitle,
    DialogActions,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { HintButton } from "../../util/HintButton";
import { SettingsPage } from "../../util/SettingsPage";
import { ContinueButton } from "../../JobCreate/ContinueButton";
import { Job } from "../index";
import { DeleteSchedule } from "../../util/deleteSchedule";
import {
    Schedule,
    withFormattedDates,
    validateSchedule,
    fromFormattedDates,
} from "../../util/schedule";
import {
    ParamValues,
    toTypedValues,
    trimParamValues,
    initSelectedValues,
    getInvalidParamValues,
} from "../../util/param";
import { hintContents } from "../../util/hintContents";
import { useCallFetch } from "../../Hooks/useCallFetch";
import { getUrl } from "../../util/fetchUtils";

interface Props {
    open: boolean;
    onClose: () => void;
    job: Job;
    handleEditSuccess: () => void;
    reportError: (msg: string) => void;
}

const initParamValues = (topics: any) => {
    return topics.map((t: any) => {
        return { ...initSelectedValues(t.params), ...t.values };
    });
};

export const JobSettings: React.FC<Props> = ({
    open,
    onClose,
    job,
    handleEditSuccess,
    reportError,
}) => {
    const classes = useStyles();
    const [edit, setEdit] = React.useState(false);
    const [hintState, setHintState] = React.useState(0);
    const [jobName, setJobName] = React.useState(job.jobName);
    const [schedule, setSchedule] = React.useState<Schedule>(fromFormattedDates(job.schedule));
    const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>(job.deleteSchedule);
    const [paramValues, setParamValues] = React.useState<ParamValues[]>(
        initParamValues(job.topicValues)
    );
    const [invalidValues, setInvalidValues] = React.useState<string[][]>([]);
    const [jobNameInvalid, setJobNameInvalid] = React.useState(false);

    const handleEditError = () => {
        reportError("Bearbeitung fehlgeschlagen");
    };

    const handleSelectSchedule = (schedule: Schedule) => {
        setSchedule(schedule);
    }

    const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
        setDeleteSchedule(deleteSchedule);
    };

    const emptyJobNameError = "Job-Name nicht ausgefüllt";

    const handleCheckClick = () => {
        let errorMessage = ""

        if (jobName.trim() === "") {
            setJobNameInvalid(true);
            errorMessage = emptyJobNameError;
        } else {
            setEdit(false);
            setJobNameInvalid(false);
        }

        const invalid = job.topicValues.map((t: any, idx: number) => getInvalidParamValues(paramValues[idx], t.params));
        setInvalidValues(invalid ? invalid : []);
        const paramsValid = invalid?.every(t => t.length === 0);
        if (!paramsValid) {
            errorMessage = errorMessage !== "" ? errorMessage : "Parameter nicht korrekt gesetzt";
        } else {
            setInvalidValues([]);
        }
        if (!validateSchedule(schedule)) {
            errorMessage = errorMessage !== "" ? errorMessage : "Es muss mindestens ein Wochentag ausgewählt werden";
        }

        if (errorMessage !== "") {
            reportError(errorMessage);
            return;
        }
        editJob();
    };

    const editJob = useCallFetch(
        getUrl(`/edit/${job.jobId}`),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jobName: jobName.trim(),
                topicValues: job.topicValues.map((t: any, idx: number) => {
                    return {
                        topicId: t.topicId,
                        values: toTypedValues(trimParamValues(paramValues[idx]), t.params),
                    };
                }),
                schedule: withFormattedDates(schedule),
                deleteSchedule: deleteSchedule
            }),
        },
        handleEditSuccess,
        handleEditError
    );

    const handleSelectParam = (key: string, value: any, idx: number) => {
        const updated = [...paramValues];
        updated[idx][key] = value;
        setParamValues(updated);
    };

    const hintContent = [
        <div>
            <Typography variant="h5" gutterBottom>
                Parameter bearbeiten
            </Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie die Parameter für das Video bearbeiten.
            </Typography>
        </div>,
        hintContents.time,
        hintContents.delete,
    ];

    const handleClose = () => {
        setEdit(false);
        setParamValues(initParamValues(job.topicValues));
        onClose();
    };

    const handleJobName = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setJobName(event.target.value);
    };

    const handleHintState = (hint: number) => {
        setHintState(hint);
    };

    const handleEditJobName = () => {
        if (edit && jobName.trim() === "") {
            setJobNameInvalid(true);
            reportError(emptyJobNameError);
            return;
        }
        setJobNameInvalid(false);
        setEdit(p => !p);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle className={classes.dialogTitle}>
                <Grid container>
                    <Grid item container xs={1} justify={"flex-end"}>
                        <Tooltip title="Job-Name bearbeiten" arrow>
                            <IconButton
                                onClick={handleEditJobName}
                                className={classes.button}
                            >
                                <EditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={10} style={{ paddingLeft: 50, paddingRight: 50 }}>
                        {edit ? (
                            <TextField
                                fullWidth
                                onChange={handleJobName}
                                value={jobName}
                                inputProps={{
                                    style: { textAlign: "center", fontSize: 20 },
                                }}
                                error={jobNameInvalid}
                            />
                        ) : (
                                <InputBase
                                    fullWidth
                                    disabled
                                    value={jobName}
                                    inputProps={{
                                        style: {
                                            color: "black",
                                            textAlign: "center",
                                            fontSize: 20,
                                            cursor: "default",
                                        },
                                    }}
                                />
                            )}
                    </Grid>
                    <Grid item container xs={1} justify={"flex-end"}>
                        <HintButton content={hintContent[hintState]} />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Paper variant="outlined" className={classes.dialogPaper}>
                    <SettingsPage
                        offset={-1}
                        schedule={schedule}
                        deleteSchedule={deleteSchedule}
                        selectScheduleHandler={handleSelectSchedule}
                        selectDeleteScheduleHandler={handleSelectDeleteSchedule}
                        handleHintState={handleHintState}
                        paramSelectionProps={{
                            topicNames: job.topicValues.map((t: any) => t.topicName),
                            values: paramValues,
                            params: job.topicValues.map((t: any) => t.params),
                            loadFailedProps: undefined,
                            selectParamHandler: handleSelectParam,
                            invalidValues: invalidValues
                        }}
                    />
                </Paper>
                <DialogActions className={classes.dialogActions}>
                    <ContinueButton onClick={handleCheckClick}>SPEICHERN</ContinueButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};
