import React from 'react';

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

const Joblist = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [state, setState] = React.useState({
        edit: true,
        editIcon: 'block',
        doneIcon: 'none'
    });

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleEditClick = () => {
        setState({edit: false, editIcon: 'none', doneIcon: 'block'});
    }

    const handleDoneClick = () => {
        setState({edit: true, editIcon: 'block', doneIcon: 'none'});
    }



    return (

        <div className={classes.root}>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary>
                    {expanded ? <ExpandLess className={classes.expIcon}/> : <ExpandMore className={classes.expIcon}/>}
                    <Typography className={classes.heading}>#1 Wetter DE</Typography>
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
                        <div>
                            <TextField
                                className={classes.inputFields}
                                id='standard-read-only-input'
                                label="Thema"
                                defaultValue="Wetterbericht"
                                InputProps={{
                                    readOnly: state.edit,
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                className={classes.inputFields}
                                id="standard-read-only-input"
                                label="Zeitplan"
                                defaultValue="täglich, 08:00 Uhr + 20 Uhr"
                                InputProps={{
                                    readOnly: state.edit,
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item md={6}>
                        <div>
                            <TextField
                                className={classes.inputFields}
                                id="standard-read-only-input"
                                label="Vorhersage - Format"
                                defaultValue="2 + 3"
                                InputProps={{
                                    readOnly: state.edit,
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                className={classes.inputFields}
                                id="standard-read-only-input"
                                label="bis zum nächsten Video"
                                defaultValue="0d 21h 32min"
                                InputProps={{
                                    readOnly: state.edit,
                                }}
                            />
                        </div>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

export default Joblist;