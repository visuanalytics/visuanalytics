import React from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import { ComponentContext } from "../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useCallFetch} from "../../Hooks/useCallFetch";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';


interface TypeSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const TypeSelection: React.FC<TypeSelectionProps>  = (props) => {
    //const classes = useStyles();
    const [newSource, setNewSource] = React.useState(false);
    //duplicate is necessary to disable both options at the beginning
    const [importSource, setImportSource] = React.useState(false);



    /**
     * Handler method for the "proceed" button. Passes the users choice to parent component and then proceeds.
     */
    const handleProceed = () => {
        //TODO: pass data to parent
        props.continueHandler();
    }


    //TODO: find solution for a file upload button, possibly use external component since material-ui doesnt offer one
    //const components = React.useContext(ComponentContext);
    return (
        <div>
            <FormControlLabel
                control={
                    <Checkbox checked={newSource} onChange={(e) => {if(newSource) setNewSource(false);
                    else {setNewSource(true); setImportSource(false)}}}/>
                }
                label="Eine neue Datenquelle erstellen"
            />
            <br/>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox checked={importSource} onChange={(e) => {if(importSource) setImportSource(false);
                            else {setImportSource(true); setNewSource(false)}}}/>
                    }
                    label="Eine bestehende Datenquelle importieren"
                />
                <div>
                    <input
                        disabled={!importSource}
                        type="file"
                        accept=".json"
                    />
                </div>
            </div>
            <br/>
            <Button variant="contained" size="large" onClick={props.backHandler}>
                abbrechen
            </Button>
            <Button disabled={!(newSource||(importSource/*&&fileUploaded*/))} variant="contained" size="large" onClick={handleProceed}>
                weiter
            </Button>
        </div>
    )
};
