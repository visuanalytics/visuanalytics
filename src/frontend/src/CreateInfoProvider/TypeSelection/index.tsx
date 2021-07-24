import React, {ChangeEvent} from "react";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";

interface TypeSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    alreadyHasDataSources: boolean;
}

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const TypeSelection: React.FC<TypeSelectionProps> = (props) => {
    const classes = useStyles();
    const [newSource, setNewSource] = React.useState(true);
    //duplicate is necessary to disable both options at the beginning
    const [importSource, setImportSource] = React.useState(false);
    //contains the uploaded file if the user uses the import function
    const [file, setFile] = React.useState<File | null>(null);
    //boolean flag to identify if the user has uploaded a file
    const [fileSelected, setFileSelected] = React.useState(false);
    //ref to read out the filename for basic type checking
    const fileUploader = React.useRef<HTMLInputElement>(null)
    /**
     * Handler method for a successful import request to the backend.
     * Gets the imported data and passes it to the parent.
     */
    const handleSuccess = (jsonData: any) => {
        //TODO: set parent source data to received object
    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     */
    const handleError = (err: Error) => {
        //TODO: add error handling for communication failure
    }

    //method to be called for sending import file to the backend
    const sendTestData = useCallFetch("/importSource", {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: file
        }, handleSuccess, handleError
    );


    /**
     * Event handle method for file selection by the user.
     * @param event The onChange-event for a new selected file
     * Stores the selected file in state and sets the corresponding fileSelected-flag to true.
     * Also checks if the filepath given by the browser has a .json-Extension as first type check.
     */
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files == null) {
            //TODO: error handling on null file
        } else {
            setFile(event.target.files[0]);
            setFileSelected(true);
            if (fileUploader.current !== null) {
                let splittedString = fileUploader.current.value.split(".")
                if (splittedString[splittedString.length - 1] !== "json") {
                    //TODO: throw error since non-json file was selected
                }
            }
        }
    }


    /**
     * Handler method for the "proceed" button. Passes the users choice to parent component and then proceeds.
     */
    const handleProceed = () => {
        //TODO: signal the choice to the parent
        if (importSource) {
            //TODO: File exchange with backend, send results to parent
            sendTestData();
        }
        props.continueHandler();
    }


    //TODO: find a prettier solution for a file upload button, possibly use external component since material-ui doesnt offer one
    return (
        <StepFrame
            heading={"Datenquelle"}
            hintContent={hintContents.typeSelection}
        >
            <Grid container justify="center" className={classes.elementLargeMargin}>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={newSource} onChange={(e) => {
                                if (newSource) setNewSource(false);
                                else {
                                    setNewSource(true);
                                    setImportSource(false)
                                }
                            }}/>
                        }
                        label="Eine neue Datenquelle erstellen"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel disabled={true}
                        control={
                            <Checkbox checked={importSource} onChange={(e) => {
                                if (importSource) setImportSource(false);
                                else {
                                    setImportSource(true);
                                    setNewSource(false)
                                }
                            }}/>
                        }
                        label="Eine bestehende Datenquelle importieren"
                    />
                </Grid>
                <Grid item xs={12}>
                    <input ref={fileUploader} disabled={!importSource} type="file" accept=".json"
                           onChange={handleFileSelect}/>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained"
                                size="large"
                                color={"primary"}
                                disabled={props.alreadyHasDataSources}
                                onClick={props.backHandler}
                        >
                            abbrechen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={!(newSource || (importSource && fileSelected))} variant="contained"
                                size="large"
                                color={"primary"}
                                onClick={handleProceed}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    )
};
