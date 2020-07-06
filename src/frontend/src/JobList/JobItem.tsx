import React from "react";
import {Param} from "../util/param";
import TextField from "@material-ui/core/TextField";
import {Button, Container, Fade, Modal, Paper} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import {AccordionSummary, useStyles} from "./style";
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
import {ContinueButton} from "../JobCreate/ContinueButton";
import {renderParamField} from "../util/renderParamFields";
import {Job} from "./index";
import {ScheduleSelection} from "../JobCreate/ScheduleSelection";
import {Schedule, Weekday} from "../JobCreate";


export const JobItem: React.FC<Job> = (job) => {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [state, setState] = React.useState({
        edit: true,
        editIcon: 'block',
        doneIcon: 'none'
    });
    const [open, setOpen] = React.useState(false);
    const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule>({
        daily: true,
        weekly: false,
        onDate: false,
        weekdays: [],
        date: new Date(),
        time: new Date(),
        delete: false,
        onTime: false,
        delete_old_on_new: true,
        removal_time: new Date()
    });

    // handler for schedule selection logic
    const handleSelectDaily = () => {
        setSelectedSchedule({...selectedSchedule, daily: true, weekly: false, onDate: false, weekdays: [],})
    }
    const handleSelectWeekly = () => {
        setSelectedSchedule({...selectedSchedule, daily: false, weekly: true, onDate: false, weekdays: [],})
    }
    const handleSelectOnDate = () => {
        setSelectedSchedule({...selectedSchedule, daily: false, weekly: false, onDate: true, weekdays: [],})
    }
    const handleAddWeekDay = (d: Weekday) => {
        const weekdays: Weekday[] = [...selectedSchedule.weekdays, d];
        setSelectedSchedule({...selectedSchedule, weekdays: weekdays});
    }
    const handleRemoveWeekday = (d: Weekday) => {
        const weekdays: Weekday[] = selectedSchedule.weekdays.filter(e => e !== d);
        setSelectedSchedule({...selectedSchedule, weekdays: weekdays});
    }
    const handleSelectDate = (date: Date | null) => {
        setSelectedSchedule({...selectedSchedule, date: date})
    }
    const handleSelectTime = (time: Date | null) => {
        setSelectedSchedule({...selectedSchedule, time: time})
    }

    const renderJobItem = (job: Job) => {
        const paramInfo: Param[] = job.params;

        const renderTextField = () => {
            return (
                <div>
                    <div>
                        <TextField
                            className={classes.inputFields}
                            label="Thema"
                            defaultValue={job.topic}
                            InputProps={{
                                disabled: true,
                            }}
                            variant="outlined"
                        />
                    </div>
                    <div>
                        <Button className={classes.inputButton} onClick={handleOpen}>
                            <TextField
                                className={classes.inputFields}
                                label="Zeitplan"
                                defaultValue={job.schedule}
                                InputProps={{
                                    disabled: state.edit,
                                    readOnly: true
                                }}
                                variant="outlined"
                            />
                        </Button>

                    </div>
                    <div>
                        <TextField
                            className={classes.inputFields}
                            label="nächstes Video"
                            defaultValue={job.next}
                            InputProps={{
                                disabled: true,
                            }}
                            variant="outlined"
                        />
                    </div>
                </div>
            )
        }
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
            setState(state.edit ? {edit: false, editIcon: 'none', doneIcon: 'block'} : {edit: true, editIcon: 'block', doneIcon: 'none'});
            setExpanded(job.id);
        }
        return (
            <div className={classes.root}>
                <Accordion expanded={expanded === job.id} onChange={handleChange(job.id)}>
                    <AccordionSummary>
                        {expanded ? <ExpandLess className={classes.expIcon}/> :
                            <ExpandMore className={classes.expIcon}/>}
                        <Typography className={classes.heading}>#{job.id} {job.name}</Typography>
                        <div onClick={(event) => event.stopPropagation()}>
                            <IconButton className={classes.button} onClick={handleEditClick}>
                                <EditIcon style={{display: state.editIcon}}/>
                                <CheckCircleIcon style={{display: state.doneIcon}}/>
                            </IconButton>
                        </div>
                        <div onClick={(event) => event.stopPropagation()}>
                            <IconButton className={classes.button}>
                                <DeleteIcon/>
                            </IconButton>
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
                                    <Paper variant="outlined" className={classes.paper}>
                                        <ScheduleSelection
                                            schedule={selectedSchedule}
                                            selectDailyHandler={handleSelectDaily}
                                            selectWeeklyHandler={handleSelectWeekly}
                                            selectOnDateHandler={handleSelectOnDate}
                                            addWeekDayHandler={handleAddWeekDay}
                                            removeWeekDayHandler={handleRemoveWeekday}
                                            selectDateHandler={handleSelectDate}
                                            selectTimeHandler={handleSelectTime}
                                        />
                                        <ContinueButton>SPEICHERN</ContinueButton>
                                    </Paper>
                                </Container>
                            </Fade>
                        </Modal>
                        <Grid item md={6}>
                            <div>
                                {paramInfo.map(p =>
                                    <div key={p.name}>
                                        {renderParamField(p, classes, state.edit)}
                                    </div>)
                                }
                            </div>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }

    return (
        renderJobItem(job)
    )
}