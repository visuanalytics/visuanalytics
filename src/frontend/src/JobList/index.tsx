import React from 'react';
import {Param} from "../param";
import {Props} from "../props";
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
import {MenuItem} from "@material-ui/core";

export interface Job {
    id: string;
    name: string;
    topic: string;
    schedule: string; //Datentyp?
    next: string; //Datentyp?
    params: Param[];
}

export const JobList: React.FC<Props> = ({topic}) => {
    // const jobInfo: = useFetch("/jobs?topic=" + topic);
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [state, setState] = React.useState({
        edit: true,
        editIcon: 'block',
        doneIcon: 'none'
    });
    const jobInfo: Job[] = [
        {
            "id": "1",
            "name": "Wetter DE",
            "topic": topic,
            "schedule": "täglich",
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
                        <TextField
                            className={classes.inputFields}
                            id='standard-read-only-input'
                            label="Zeitplan"
                            defaultValue={job.schedule}
                            InputProps={{
                                readOnly: state.edit,
                            }}
                        />
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

        const renderParamField = (param: Param) => {
            const name: string = param.name;
            const possibleValues: string[] = param.possibleValues;
            if (possibleValues.length === 0) {
                return (
                    <TextField
                        className={classes.inputFields}
                        variant="outlined"
                        label={name}/>
                )
            }
            return (
                <TextField
                    className={classes.inputFields}
                    variant="outlined"
                    label={name}
                    defaultValue={param.selected}
                    InputProps={{
                        readOnly: state.edit,
                    }}
                    select>
                    {possibleValues.map((val) => (
                        <MenuItem key={val} value={val}>
                            {val}
                        </MenuItem>
                    ))}
                </TextField>
            )
        }

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
                        <Grid item md={6}>
                            <div>
                                {paramInfo.map(p =>
                                    <div>
                                        {renderParamField(p)}
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