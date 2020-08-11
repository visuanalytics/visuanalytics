import React, { useEffect } from "react";
import { ParamValues, toTypedValues, trimParamValues, validateParamValues, initSelectedValues } from "../util/param";
import { Button, Container, Fade, InputBase, Modal, Paper, withStyles, TextField, Tooltip, Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import { AccordionSummary, useStyles } from "./style";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { Job } from "./index";
import { ScheduleSelection } from "../JobCreate/ScheduleSelection";
import { useCallFetch } from "../Hooks/useCallFetch";
import { ParamFields } from "../ParamFields";
import { Schedule, withFormattedDates, showSchedule, fromFormattedDates, showTimeToNextDate, validateSchedule } from "../util/schedule";
import { getUrl } from "../util/fetchUtils";

import { HintButton } from "../util/HintButton";

interface Props {
    job: Job,
    getJobs: () => void;
    reportError: (message: string) => void;
    reportSuccess: (message: string) => void;
}

export const JobItem: React.FC<Props> = ({ job, getJobs, reportError, reportSuccess }) => {
    const classes = useStyles();

    const [noEdit, setNoEdit] = React.useState(true);

    const NameInput = withStyles({
        root: {
            cursor: "pointer",
        },
        input: {
            cursor: noEdit ? 'pointer' : 'text',
            padding: '0 8px',
            marginLeft: '8px',
            color: 'white',
            fontSize: '1.5625rem',
            borderBottom: noEdit ? '' : '2px solid #c4c4c4'
        },
    })(InputBase);

    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [jobName, setJobName] = React.useState(job.jobName);
    const [open, setOpen] = React.useState(false);
    const [paramValues, setParamValues] = React.useState<ParamValues>({ ...initSelectedValues(job.params), ...job.values });
    const [schedule, setSchedule] = React.useState<Schedule>(fromFormattedDates(job.schedule));
    const [next, setNext] = React.useState(showTimeToNextDate(schedule));
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const handleSelectSchedule = (schedule: Schedule) => {
        setSchedule(schedule);
    }

    const handleSelectParam = (key: string, value: any) => {
        const updated = { ...paramValues }
        updated[key] = value;
        setParamValues(updated);
    }

    const handleJobName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobName(event.target.value);
    }

    const handleEditError = () => {
        reportError("Bearbeitung fehlgeschlagen")
    }

    const handleEditSuccess = () => {
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

    const deleteJob = useCallFetch(getUrl(`/remove/${job.jobId}`), { method: 'DELETE' }, handleDeleteJobSucess, handleDeleteJobFailure);

    const editJob = useCallFetch(getUrl(`/edit/${job.jobId}`), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jobName: jobName.trim(),
            values: toTypedValues(trimParamValues(paramValues), job.params),
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
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
        const handleEditClick = () => {
            setNoEdit(!noEdit);
            setExpanded(String(job.jobId));
        }

        const handleCheckClick = () => {
            if (jobName.trim() === "") {
                reportError("Jobname nicht ausgefüllt")
                return;
            }
            if (!validateParamValues(paramValues, job.params)) {
                reportError("Parameter nicht korrekt gesetzt")
                return;
            }
            if (!validateSchedule(schedule)) {
                reportError("Es muss mindestens ein Wochentag ausgewählt werden")
                return;
            }
            handleEditClick();
            editJob();
        }
        const handleSaveModal = () => {
            handleCheckClick();
            handleClose();
        }

        const handleDeleteJob = () => {
            setConfirmDelete(false)
            deleteJob()
        }

        const renderTextField = () => {
            return (
                <div>
                    <div className={classes.SPaddingTRB}>
                        <TextField
                            label="Thema"
                            defaultValue={job.topicName}
                            InputProps={{
                                disabled: true,
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <div className={classes.SPaddingTRB}>
                        <Tooltip title={noEdit ? "" : "Zeitplan bearbeiten"}
                            arrow
                        >
                            <Button className={classes.inputButton} onClick={handleOpen} disabled={noEdit}>
                                <TextField
                                    label="Zeitplan"
                                    value={showSchedule(schedule)}
                                    disabled={noEdit}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    required={!noEdit}
                                    variant="outlined"
                                    fullWidth
                                    error={!validateSchedule(schedule)}
                                />
                            </Button>
                        </Tooltip>
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
                        <Typography component="span" className={classes.heading}>#{job.jobId}
                            <NameInput
                                // autoFocus={true}
                                value={jobName}
                                readOnly={noEdit}
                                onClick={noEdit ? () => {
                                } : (event) => event.stopPropagation()}
                                onChange={handleJobName}
                            >
                                {job.jobName}</NameInput></Typography>
                        <div onClick={(event) => event.stopPropagation()}>
                            <Tooltip title={noEdit ? "Job bearbeiten" : "Job speichern"} arrow>
                                <IconButton  className={classes.button}
                                    onClick={noEdit ? handleEditClick : handleCheckClick} >
                                    {noEdit ? <EditIcon /> : <CheckCircleIcon />}
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div onClick={(event) => event.stopPropagation()}>
                            <Tooltip title="Job löschen" arrow>
                                <IconButton 
                                    onClick={() => setConfirmDelete(true)} 
                                    className={classes.button}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid item md={6}>
                            {renderTextField()}
                        </Grid>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                                <Container className={classes.backdropContent}>
                                    <Grid container>
                                        <Grid xs={11} />
                                        <Grid container xs={1} justify={"flex-end"}>
                                            <HintButton content={
                                                <div>
                                                    <Typography variant="h5" gutterBottom>Zeitplan
                                                        auswählen</Typography>
                                                    <Typography gutterBottom>
                                                        Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das
                                                        Video generiert werden soll.
                                                    </Typography>
                                                    <Typography variant="h6">täglich</Typography>
                                                    <Typography gutterBottom>Das Video wird täglich zur unten
                                                        angegebenen Uhrzeit erstellt</Typography>
                                                    <Typography variant="h6">wöchentlich</Typography>
                                                    <Typography gutterBottom>Das Video wird zu den angegebenen
                                                    Wochentagen wöchentlich zur unten angegebenen Uhrzeit
                                                        erstellt</Typography>
                                                    <Typography variant="h6">an festem Datum</Typography>
                                                    <Typography gutterBottom>Das Video wird zum angegebenen Datum und
                                                        zur angegebenen Uhrzeit erstellt</Typography>
                                                </div>
                                            } />
                                        </Grid>
                                    </Grid>
                                    <Paper variant="outlined" className={classes.paper}>
                                        <ScheduleSelection
                                            schedule={schedule}
                                            selectScheduleHandler={handleSelectSchedule}
                                        />
                                        <ContinueButton onClick={handleSaveModal}>SPEICHERN</ContinueButton>
                                    </Paper>
                                </Container>
                            </Fade>
                        </Modal>
                        <Grid item md={6}>
                            <div>
                                <ParamFields
                                    params={job.params}
                                    values={paramValues}
                                    selectParamHandler={handleSelectParam}
                                    disabled={noEdit}
                                    required={!noEdit}
                                />
                            </div>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Dialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                >
                    <DialogTitle>
                        {`Job '#${job.jobId} ${job.jobName}' löchen?`}
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