import React, {useEffect} from "react";
import {Param} from "../util/param";
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
import {parse, isPast, addDays, setDay, formatDistanceToNowStrict, getDay, format} from "date-fns";
import de from "date-fns/esm/locale/de";
import { useCallFetch } from "../Hooks/useCallFetch";
import {getWeekdayLabel} from "../util/getWeekdayLabel";
import TextField from "@material-ui/core/TextField";

interface Props {
    job: Job,
    getJobs: () => void;
}

export const JobItem: React.FC<Props> = ({job, getJobs}) => {
    const classes = useStyles();
    const deleteJob = useCallFetch(`/remove/${job.jobId}`, {method: 'DELETE'}, getJobs);

    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [state, setState] = React.useState({
        edit: true,
        editIcon: 'block',
        doneIcon: 'none'
    });
    const [open, setOpen] = React.useState(false);
    const [selectedParams, setSelectedParams] = React.useState<Param[]>(job.params);
    const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule>({
        daily: job.schedule.daily,
        weekly: job.schedule.weekly,
        onDate: job.schedule.onDate,
        weekdays: job.schedule.weekdays.map(w => Number(w)),
        date: parse(`${job.schedule.time}-${job.schedule.date}`, "H:m-y-MM-dd", new Date()),
        time: parse(String(job.schedule.time), "H:m", new Date()),
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
    const handleSelectParam = (key: string, value: string) => {
        const newList = selectedParams?.map((e: Param) => {
            if (e.name === key) {
                return { ...e, selected: value };
            }
            return e;
        })
        setSelectedParams(newList);
    }

    const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        handleSelectParam(name, event.target.value);
    }

    const showTime = () => {
        if (job.schedule.daily) {
            return "täglich, " + job.schedule.time + " Uhr";
        } else if (job.schedule.onDate) {
            return format(parse(String(job.schedule.date),"y-MM-dd", new Date()),"dd.MM.yyyy") +", " + job.schedule.time + " Uhr";
        } else if (job.schedule.weekly) {
            return "wöchentlich: " + job.schedule.weekdays.map(w => getWeekdayLabel(Number(w))) + ", " + job.schedule.time + " Uhr";
        }
    }

    const getHighestNumber = (list: number[], weekday: number) => {
        var nextNum: number = 7;
        for (var i = 0; i<list.length;i++) {
            if (list[i] > weekday && list[i] < nextNum) {
                nextNum = list[i];
            }
        }
        return nextNum;
    }

    // TODO May move to util component
    const getNextDate = () => {
        if(job.schedule.onDate) {
            return parse(`${job.schedule.time}-${job.schedule.date}`, "H:m-y-MM-dd", new Date());
        } else if (job.schedule.daily) {
            const time = parse(String(job.schedule.time), "H:m", new Date());
            return  isPast(time) ? addDays(time, 1) : time
        } else if (job.schedule.weekly) {
            const curWeekday = getDay(new Date()) - 1;
            const time = parse(String(job.schedule.time), "H:m", setDay(new Date(),Number(getHighestNumber(job.schedule.weekdays, curWeekday)) + 1));
            return  isPast(time) ? addDays(time, 7) : time;
        } else {
            return new Date();
        }
    }

    const nextJob = () => {
        return formatDistanceToNowStrict(getNextDate(), {locale: de, addSuffix: true});
    }

    const [next, setNext] = React.useState(nextJob());

    useEffect(() => {
        const interval = setInterval(() => {
            setNext(nextJob);
        }, 60000);
        return () => clearInterval(interval);
    }, [nextJob]);

    useEffect(() => {
        setNext(nextJob);
    },[nextJob()]);

    const editJob = useCallFetch(`/edit/${job.jobId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            params: selectedParams,
            schedule: {
                daily: selectedSchedule.daily,
                weekly: selectedSchedule.weekly,
                onDate: selectedSchedule.onDate,
                time: selectedSchedule.time?.toLocaleTimeString("de-DE").slice(0, -3),
                weekdays: selectedSchedule.weekdays,
                date: selectedSchedule.onDate ? format(parse(String(job.schedule.date),"y-MM-dd", new Date()),"yyyy-MM-dd") : null
            }
        })
    },getJobs);

    const renderJobItem = (job: Job) => {
        const paramInfo: Param[] = selectedParams;

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
            setExpanded(String(job.jobId));
        }

        const handleCheckClick = () => {
            handleEditClick();
            editJob();
        }
        const handleSaveModal = () => {
            handleCheckClick();
            handleClose();
        }

        const renderTextField = () => {
            return (
                <div>
                    <div>
                        <TextField
                            className={classes.inputFields}
                            label="Thema"
                            defaultValue={job.topicName}
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
                                value={showTime()}
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
                            value={next}
                            InputProps={{
                                disabled: true,
                            }}
                            variant="outlined"
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.root}>
                <Accordion expanded={expanded === String(job.jobId)} onChange={handleChange(String(job.jobId))}>
                    <AccordionSummary>
                        {expanded ? <ExpandLess className={classes.expIcon}/> :
                            <ExpandMore className={classes.expIcon}/>}
                        <Typography className={classes.heading}>#{job.jobId} {job.jobName}</Typography>
                        <div onClick={(event) => event.stopPropagation()}>
                            <IconButton style={{display: state.editIcon}} className={classes.button} onClick={handleEditClick}>
                                <EditIcon />
                            </IconButton>
                            <IconButton style={{display: state.doneIcon}} className={classes.button} onClick={handleCheckClick}>
                                <CheckCircleIcon />
                            </IconButton>
                        </div>
                        <div onClick={(event) => event.stopPropagation()}>
                            <IconButton onClick={deleteJob} className={classes.button}>
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
                                        <ContinueButton onClick={handleSaveModal}>SPEICHERN</ContinueButton>
                                    </Paper>
                                </Container>
                            </Fade>
                        </Modal>
                        <Grid item md={6}>
                            <div>
                                {paramInfo.map(p =>
                                    <div key={p.name}>
                                        {renderParamField(p, classes, state.edit, true, (e) => {
                                            handleParamChange(e, p.name)
                                        })}
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