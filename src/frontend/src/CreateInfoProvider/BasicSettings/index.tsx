import React from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";
import { APIInputField } from "./APIInputField/APIInputField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface BasicSettingsProps {
    continueHandler: () => void;
    backHandler: () => void;
};

export const BasicSettings: React.FC<BasicSettingsProps>  = (props) => {
    //const classes = useStyles();
    const [name, setName] = React.useState("");
    const [query, setQuery] = React.useState("");
    const [key, setKey] = React.useState("");
    const [noKey, setNoKey] = React.useState(false);
    const components = React.useContext(ComponentContext);
    return (
        <div>
            <form>
                <p>
                    Bitte wählen sie einen Namen für ihre API-Datenquelle:
                </p>
                <APIInputField
                    defaultValue="Name der API-Datenquelle"
                    value={name}
                    changeHandler={(s) => {setName(s)}}
                />
                <p>
                    Bitte geben sie die Query an, die der Info-Provider nutzen soll:
                </p>
                <APIInputField
                    defaultValue="Ihre API-Query"
                    value={query}
                    changeHandler={(s) => {setQuery(s)}}
                />
                <p>
                    Bitte geben sie den API-Key für ihre Anfragen ein:
                </p>
                <APIInputField
                    defaultValue="Ihr API-Key"
                    value={key}
                    changeHandler={(s) => {setKey(s)}}
                    noKey={noKey}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Checkbox checked={noKey} onChange={(e) => setNoKey(!noKey)}/>
                    }
                    label="Diese API benötigt keinen key"
                />
                <br/>
                <Button variant="contained" size="large" onClick={props.backHandler}>
                    zurück
                </Button>
                <Button variant="contained" size="large" onClick={props.continueHandler}>
                    weiter
                </Button>
            </form>
        </div>
    );
};
