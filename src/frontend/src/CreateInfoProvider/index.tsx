import React, {useCallback} from "react";
import {
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Paper,
    Typography,
} from "@material-ui/core";
import { JobList } from "../JobList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../PageTemplate";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BasicSettings } from "./BasicSettings";
import {useStyles} from "../Home/style";
import JobCreate from "../JobCreate";
import { useCallFetch } from "../Hooks/useCallFetch";

/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider = () => {
    //const classes = useStyles();
    //the current step of the creation process, numbered by 1 to 5
    const [step, setStep] = React.useState(2);
    //holds the data delivered from the currently created API
    const [apiData, setApiData] = React.useState({});


    /**
     * Method that checks if the given name is already in use for a data source in this info-provider
     * @param name Name that should be checked.
     * Return true if the name is already in use for this Info-Provider
     */
    const checkNameDuplicate = (name: string) => {
        //if(name is contained) return true
        //else return false
        return false //TODO: to be removed when the check is implemented
    }


    const handleContinue = () => {
        setStep(step+1);
    }

    const handleBack = () => {
        //if step==1, return to dashboard context
        setStep(step-1)
    }


    const selectContent = (step: number) => {
        switch (step) {
            case 1:
                return (
                    <div>
                        this is step 1
                    </div>
                );
            case 2:
                return (
                    <BasicSettings
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        setApiData={setApiData}
                        checkNameDuplicate={checkNameDuplicate}
                    />
                );
            case 3:
                return (
                    <div>
                        this is step 3
                    </div>
                );
        }
    }
    return (
        <div>
            {selectContent(step)}
        </div>
    );
};
