import React, { useEffect } from "react";
import {
    ParamValues,
    toTypedValues,
    trimParamValues,
    validateParamValues,
    initSelectedValues,
    Param
} from "../util/param";
import {
    Button,
    Container,
    Fade,
    Modal,
    Paper,
    TextField,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogActions,
    Divider,
    InputBase
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import { AccordionSummary, useStyles } from "./style";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import DescriptionIcon from "@material-ui/icons/Description";
import {
    Schedule,
    withFormattedDates,
    showSchedule,
    fromFormattedDates,
    showTimeToNextDate,
    validateSchedule
} from "../util/schedule";
import { ComponentContext } from "../ComponentProvider";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { Job } from "./index";
import { useCallFetch } from "../Hooks/useCallFetch";
import { ParamFields } from "../ParamFields";
import { getUrl } from "../util/fetchUtils";
import { NameInput } from "./NameInput"
import { HintButton } from "../util/HintButton";
import { DeleteSchedule } from "../util/deleteSchedule";
import { SettingsPage } from "../util/SettingsPage";

interface Props {
    job: Job,
    getJobs: () => void;
    reportError: (message: string) => void;
    reportSuccess: (message: string) => void;
}

export const JobItem: React.FC<Props> = ({ job, getJobs, reportError, reportSuccess }) => {
    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    const [hintState, setHintState] = React.useState(0);

    const initParamValues = (topics: any) => {
        return topics.map((t: any) => {
            return { ...initSelectedValues(t.params), ...t.values }
        })
    }

    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [jobName, setJobName] = React.useState(job.jobName);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [noEdit, setNoEdit] = React.useState(true);
    const [paramValues, setParamValues] = React.useState<ParamValues[]>(initParamValues(job.topics));
    const [schedule, setSchedule] = React.useState<Schedule>(fromFormattedDates(job.schedule));
    const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>({ type: "noDeletion" })
    const [next, setNext] = React.useState(showTimeToNextDate(schedule));
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const hintContent = [
        <div>
            <Typography variant="h5" gutterBottom>Zeitplan auswählen</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video generiert werden soll.
            </Typography>
            <Typography variant="h6">täglich</Typography>
            <Typography gutterBottom>Das Video wird täglich zur unten angegebenen Uhrzeit erstellt</Typography>
            <Typography variant="h6">wöchentlich</Typography>
            <Typography gutterBottom>Das Video wird zu den angegebenen Wochentagen wöchentlich zur unten angegebenen
                Uhrzeit erstellt</Typography>
            <Typography variant="h6">Intervall</Typography>
            <Typography gutterBottom>Das Video wird nach dem angegebenen Intervall generiert</Typography>
            <Typography variant="h6">an festem Datum</Typography>
            <Typography gutterBottom>Das Video wird zum angegebenen Datum und zur angegebenen Uhrzeit
                erstellt</Typography>
        </div>,
        <div>
            <Typography variant="h5" gutterBottom>Löschen</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video gelöscht werden soll.
            </Typography>
            <Typography variant="h6">nie</Typography>
            <Typography gutterBottom>Das Video wird nie gelöscht</Typography>
            <Typography variant="h6">nach Zeit</Typography>
            <Typography gutterBottom>Das Video wird nach einer bestimmten Anzahl an Tagen und Stunden
                gelöscht</Typography>
            <Typography variant="h6">nach Anzahl</Typography>
            <Typography gutterBottom>Das Video wird nach einer bestimmten Anzahl an generierten Videos
                gelöscht</Typography>
            <Typography variant="h6">feste Namen</Typography>
            <Typography gutterBottom>Es wird eine bestimmte Anzahl an Videos generiert, wobei das neuste immer den
                Namen <i>jobName</i>_1 besitzt</Typography>
        </div>,
        <div>
            <Typography variant="h5" gutterBottom>Parameter bearbeiten</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie die Parameter für das Video bearbeiten.
            </Typography>
        </div>,
    ]

    const handleSelectSchedule = (schedule: Schedule) => {
        setSchedule(schedule);
    }

    const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
        setDeleteSchedule(deleteSchedule);
    }

    const handleSelectParam = (key: string, value: any, idx: number) => {
        const updated = [...paramValues]
        updated[idx][key] = value;
        setParamValues(updated);
    }

    const handleJobName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobName(event.target.value);
    }

    const handleEditError = () => {
        reportError("Bearbeitung fehlgeschlagen")
    }

    const handleEditSuccess = () => {
        setOpenSettings(false);
        setNoEdit(true);
        getJobs()
        reportSuccess("Job erfolgreich geändert")
    }

    const handleDeleteJobSucess = () => {
        getJobs()
        reportSuccess("Job erfolgreich gelöscht")
    }

    const handleDeleteJobFailure = () => {
        reportError("Job konnte nicht gelöscht werden")
    }

    const handleHintState = (hint: number) => {
        setHintState(hint);
    }

    const deleteJob = useCallFetch(getUrl(`/remove/${job.jobId}`), { method: 'DELETE' }, handleDeleteJobSucess, handleDeleteJobFailure);

    const editJob = useCallFetch(getUrl(`/edit/${job.jobId}`), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jobName: jobName.trim(),
            topics: job.topics.map((t: any, idx: number) => {
                return {
                    topicId: t.topicId,
                    values: toTypedValues(trimParamValues(paramValues[idx]), t.params)
                }
            }),
            schedule: withFormattedDates(schedule)
        })
    }, handleEditSuccess, handleEditError);

    useEffect(() => {
        const interval = setInterval(() => {
            setNext(showTimeToNextDate(schedule));
        }, 60000);
        return () => clearInterval(interval);
    }, [schedule]);

    useEffect(() => {
        setNext(showTimeToNextDate(schedule));
    }, [schedule]);

    const renderJobItem = (job: Job) => {

        const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

        const handleCheckClick = () => {
            if (jobName.trim() === "") {
                reportError("Jobname nicht ausgefüllt")
                return;
            }
            if (!job.topics.every((t: any, idx: number) => validateParamValues(paramValues[idx], t.params))) {
                reportError("Parameter nicht korrekt gesetzt")
                return;
            }
            if (!validateSchedule(schedule)) {
                reportError("Es muss mindestens ein Wochentag ausgewählt werden")
                return;
            }
            editJob();
        }
        const handleSaveModal = () => {
            handleCheckClick();
        }

        const handleCloseModal = () => {
            setNoEdit(true);
            setOpenSettings(false);
            setParamValues(initParamValues(job.topics));
            setJobName(job.jobName);
            setSchedule(fromFormattedDates(job.schedule));
        }

        const handleDeleteJob = () => {
            setConfirmDelete(false);
            deleteJob();
        }

        const renderTextField = () => {
            return (
                <div>
                    <div className={classes.SPaddingTRB}>
                        <TextField
                            label="Thema"
                            defaultValue={String(job.topics.map((t: any) => t.topicName)).split(",").join(", ")}
                            InputProps={{
                                disabled: true,
                            }}
                            multiline
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <div className={classes.SPaddingTRB}>
                        <TextField
                            label="Zeitplan"
                            value={showSchedule(fromFormattedDates(job.schedule))}
                            InputProps={{
                                disabled: true,
                            }}
                            required={!noEdit}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <div>
                    </div>
                    <div className={classes.SPaddingTRB}>
                        <TextField
                            label="nächstes Video"
                            value={next}
                            InputProps={{
                                disabled: true,
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.root}>
                <Accordion expanded={expanded === String(job.jobId)} onChange={handleChange(String(job.jobId))}>
                    <AccordionSummary>
                        {expanded ? <ExpandLess className={classes.expIcon} /> :
                            <ExpandMore className={classes.expIcon} />}
                        <Typography component="span" className={classes.heading}>
                            #{job.jobId}
                            <NameInput
                                value={job.jobName}
                                readOnly
                                inputProps={{
                                    style: {
                                        cursor: "pointer",
                                    }
                                }}>
                                {job.jobName}
                            </NameInput>
                        </Typography>
                        <div onClick={(event) => event.stopPropagation()}>
                            <Tooltip title="Logs öffnen" arrow>
                                <IconButton onClick={() => components?.setCurrent("jobLogs", { jobId: job.jobId })}
                                    className={classes.button}>
                                    <DescriptionIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div onClick={(event) => event.stopPropagation()}>
                            <Tooltip title="Job löschen" arrow>
                                <IconButton
                                    onClick={() => setConfirmDelete(true)}
                                    className={classes.button}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div onClick={(event) => event.stopPropagation()}>
                            <Tooltip title="Konfiguration" arrow>
                                <IconButton
                                    onClick={() => setOpenSettings(true)}
                                    className={classes.button}>
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid md={1} />
                        <Grid md={10}>
                            {renderTextField()}
                        </Grid>
                        <Grid md={1} />

                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={openSettings}
                            onClose={handleCloseModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={openSettings}>
                                <Container className={classes.backdropContent}>
                                    <Grid container>
                                        <Grid item container xs={1} justify={"flex-end"}>
                                            <Tooltip title="Job-Name bearbeiten" arrow>
                                                <IconButton
                                                    onClick={() => setNoEdit((b => !b))}
                                                    className={classes.button}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10}>
                                            {
                                                noEdit
                                                    ?
                                                    (<InputBase
                                                        fullWidth
                                                        disabled
                                                        value={jobName}
                                                        inputProps={{
                                                            style: {
                                                                color: "black",
                                                                textAlign: "center",
                                                                fontSize: 20,
                                                                cursor: "default"
                                                            }
                                                        }}
                                                    />)
                                                    :
                                                    (<TextField
                                                        fullWidth
                                                        onChange={handleJobName}
                                                        value={jobName}
                                                        inputProps={{
                                                            style: { textAlign: "center", fontSize: 20 }
                                                        }} />)
                                            }
                                        </Grid>
                                        <Grid item container xs={1} justify={"flex-end"}>
                                            <HintButton content={hintContent[hintState]} />
                                        </Grid>
                                    </Grid>
                                    <Paper variant="outlined" className={classes.paper}
                                        style={{ maxHeight: 600, overflow: 'auto' }}>
                                        <SettingsPage
                                            offset={-1}
                                            schedule={schedule}
                                            deleteSchedule={deleteSchedule}
                                            selectScheduleHandler={handleSelectSchedule}
                                            selectDeleteScheduleHandler={handleSelectDeleteSchedule}
                                            handleHintState={handleHintState}
                                            paramSelectionProps={{
                                                topicNames: job.topics.map((t: any) => t.topicName),
                                                values: paramValues,
                                                params: job.topics.map((t: any) => t.params),
                                                loadFailedProps: undefined,
                                                selectParamHandler: handleSelectParam
                                            }}
                                        />
                                    </Paper>
                                    <div>
                                        <div style={{ textAlign: "center", paddingTop: 15 }}>
                                            <ContinueButton onClick={handleSaveModal}>SPEICHERN</ContinueButton>
                                        </div>
                                    </div>
                                </Container>
                            </Fade>
                        </Modal>
                    </AccordionDetails>
                </Accordion>
                <Dialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                >
                    <DialogTitle>
                        {`Job '#${job.jobId} ${job.jobName}' löschen?`}
                    </DialogTitle>
                    <DialogActions>
                        <Button autoFocus onClick={() => setConfirmDelete(false)} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={handleDeleteJob} color="primary">
                            Löschen
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    return (
        renderJobItem(job)
    )
}