import React from "react";
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

export const CreateInfoProvider = () => {
    //const classes = useStyles();
    const [step, setStep] = React.useState(2)

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
