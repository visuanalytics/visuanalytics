import React from "react";
import {useStyles} from "../style";
import {InfoProviderData} from "../index";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Box from "@material-ui/core/Box";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {DataSource} from "../../CreateInfoProvider";

interface InfoProviderSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProviderList: Array<InfoProviderData>;
    reportError: (message: string) => void;
    setInfoProvider: (infoProvider: Array<DataSource>) => void;
}

export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();
    //stores the id currently selected infoprovider - 0 is forbidden by the backend so it can be used as a default value
    const [selectedId, setSelectedId] = React.useState(0);

    /**
     * Handler for a successful request to the backend for receiving the API data.
     * Passes the received data to the parent component and proceeds to the next step.
     * param @jsonData The JSON-object delivered by the backend
     */
    const handleFetchInfoProviderSuccess = (jsonData: any) => {
        const data = jsonData;
        console.log(jsonData);
        //TODO: check for errors and set the data of the props infoProvider
        props.continueHandler();
    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err Error delivered by the backend
     */
    const handleFetchInfoProviderError = (err: Error) => {
        props.reportError("Fehler: Senden der Daten an das Backend fehlgeschlagen! (" + err.message + ")");;
    }

    const fetchInfoProviderById = useCallFetch("visuanalytics/infoprovider/" + selectedId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json\n"
        }
    }, handleFetchInfoProviderSuccess, handleFetchInfoProviderError);


    /**
     * Renders an radio button item in the list of all available Infoproviders.
     */
    const renderListItem = (infoProvider: InfoProviderData) => {
        return (
            <FormControlLabel value={infoProvider.infoprovider_id} control={
                <Radio
                />
            } label={infoProvider.infoprovider_name} key={infoProvider.infoprovider_id}
            />
        )
    }

    return (
        <StepFrame
            heading={"Infoprovider auswählen"}
            hintContent={hintContents.typeSelection}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Wählen sie den Infoprovider aus, dessen Daten in der Szenenerstellung zur Verfügung stehen sollen.
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <FormControl>
                            <RadioGroup value={selectedId}
                                        onChange={(e) => setSelectedId(Number(e.target.value))}>
                                {props.infoProviderList.map((infoProvider) => renderListItem(infoProvider))}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained"
                                size="large"
                                color={"primary"}
                                onClick={props.backHandler}
                        >
                            abbrechen
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonPrimary}>
                        <Button disabled={ selectedId === 0 } variant="contained"
                                size="large"
                                color={"primary"}
                                onClick={() => fetchInfoProviderById()}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </StepFrame>
    );
}
