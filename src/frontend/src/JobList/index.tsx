import React from 'react';
import {Param} from "../util/param";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {useStyles} from "./style";
import {ExpansionPanelSummary} from "./style";
import {renderParamField} from "../util/renderParamFields";
import {Button} from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import {ScheduleSelection} from "../JobCreate/ScheduleSelection";

export interface Job {
    id: string;
    name: string;
    topic: string;
    schedule: string; //Datentyp?
    next: string; //Datentyp?
    params: Param[];
}

export const JobList: React.FC = () => {
    // const jobInfo: Job[] = useFetch("/jobs");
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [state, setState] = React.useState({
        edit: true,
        editIcon: 'block',
        doneIcon: 'none'
    });
    const [open, setOpen] = React.useState(false);
    const jobInfo: Job[] = [
        {
            "id": "1",
            "name": "Wetter DE",
            "topic": "Wetter",
            "schedule": "täglich",
            "next": "0d 21h 32min",
            "params": [
                {
                    "name": "Vorhersage",
                    "selected": "2+3",
                    "possibleValues": ["2","2+3"]
                }
            ]
        },
        {
            "id": "2",
            "name": "Wetter Gießen",
            "topic": "Wetter",
            "schedule": "wöchentlich",
            "next": "0d 21h 32min",
            "params": [
                {
                    "name": "Vorhersage",
                    "selected": "2+3",
                    "possibleValues": ["2","2+3"]
                }
            ]
        }
    ]

    const renderJobItem = (job: Job) => {
        const paramInfo: Param[] = job.params;

        const renderTextField = () => {
            return (
                <div>
                    <div>
                        <TextField
                            className={classes.inputFields}
                            id='standard-read-only-input'
                            label="Thema"
                            defaultValue={job.topic}
                            InputProps={{
                                readOnly: state.edit,
                            }}
                        />
                    </div>
                    <div>
                        <Button className={classes.inputButton} onClick={handleToggle}>
                            <TextField
                                className={classes.inputFields}
                                id='standard-read-only-input'
                                label="Zeitplan"
                                defaultValue={job.schedule}
                                InputProps={{
                                    readOnly: state.edit,
                                }}
                            />
                        </Button>

                    </div>
                    <div>
                        <TextField
                            className={classes.inputFields}
                            id='standard-read-only-input'
                            label="nächstes Video"
                            defaultValue={job.next}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>
                </div>
            )
        }
        const handleClose = () => {
            setOpen(false);
        };
        const handleToggle = () => {
            setOpen(!open);
        };

        const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
        const handleEditClick = () => {
            setState({edit: false, editIcon: 'none', doneIcon: 'block'});
            setExpanded(job.id);
        }
        const handleDoneClick = () => {
            setState({edit: true, editIcon: 'block', doneIcon: 'none'});
        }
        return (
            <div className={classes.root}>
                <ExpansionPanel expanded={expanded === job.id} onChange={handleChange(job.id)}>
                    <ExpansionPanelSummary>
                        {expanded ? <ExpandLess className={classes.expIcon}/> :
                            <ExpandMore className={classes.expIcon}/>}
                        <Typography className={classes.heading}>#{job.id} {job.name}</Typography>
                        <IconButton className={classes.button} onClick={(event) => event.stopPropagation()}>
                            <EditIcon style={{display: state.editIcon}} onClick={handleEditClick}/>
                            <CheckCircleIcon style={{display: state.doneIcon}} onClick={handleDoneClick}/>
                        </IconButton>
                        <IconButton className={classes.button} onClick={(event) => event.stopPropagation()}>
                            <SettingsIcon/>
                        </IconButton>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid item md={6}>
                            {renderTextField()}
                        </Grid>
                        <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                            <ScheduleSelection />
                        </Backdrop>
                        <Grid item md={6}>
                            <div>
                                {paramInfo.map(p =>
                                    <div>
                                        {renderParamField(p,classes,state.edit)}
                                    </div>)
                                }
                            </div>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }

    return (
        <>
            {jobInfo.map(j =>
                <div>
                    {renderJobItem(j)}
                </div>)
            }
        </>
    )

}