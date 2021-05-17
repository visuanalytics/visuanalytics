import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {Grid, Typography} from "@material-ui/core";
import {ComponentContext} from "../../../ComponentProvider";
import {hintContents} from "../../../util/hintContents";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import {useStyles} from "../../style";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {InfoProviderList} from "./InfoProviderList";
import {useCallFetch} from "../../../Hooks/useCallFetch";

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
 export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * This type is needed because the answer of the backend consists of a list of jsonRef's
 */
type requestBackendAnswer = Array<jsonRef>

//bisher nur zum testen verwendet.
type answer = {
    err_msg: string;
}

/**
 * Renders the whole infoprovider-overview component except the infoprovider-list
 */
export const InfoProviderOverview: React.FC = () => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    /**
     * safes the infoprovider
     */
    const [infoprovider, setInfoProvider] = React.useState(new Array<jsonRef>());

    /**
     * safes the current Id to delete the right infoprovider
     */
    const [currentId, setCurrentId] = React.useState(0);

    /**
     * the list of infoprovider is generated automatically when the component is shown
     */
    React.useEffect(() => {
            getAll();
        }, []
    );

    /**
     * Handles the success of the getAll()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider
     * @param jsonData the answer from the backend
     */
    const handleSuccessGetAll = (jsonData: any) => {
        const data = jsonData as requestBackendAnswer;
        setInfoProvider(data);
    }

    /**
     * Handles the success of the deleteInfoprovider()-method.
     * The right infoprovider must also be deleted from the-infoprovider-constant to render the new list correctly.
     * @param jsonData the answer from the backend
     */
    const handleSuccessDelete = (jsonData: any) => {

        const data = jsonData as answer;

        console.log("handlesuccess: " + data.err_msg)
/*
        for (let i: number = 0; i <= infoprovider.length - 1; i++) {
            if (infoprovider[i].infoprovider_id === currentId) {
                const arCopy = infoprovider.slice();
                arCopy.splice(i, 1);
                setInfoProvider(arCopy);
                alert('true');
                return
            }
        }

 */
    }

    /**
     * Handles the error-message if an error appears
     * @param err the shown error
     */
    const handleError = (err: Error) => {
        console.log('error');
        alert('Fehler! : ' + err);
    }

    /**
     * Requests all infoprovider from the backend that are saved in the database
     */
    const getAll = useCallFetch("/visuanalytics/infoprovider/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessGetAll, handleError
    );

    /**
     * Request for the backend to delete an infoprovider
     */
    const deleteInfoProvider = useCallFetch("visuanalytics/infoprovider/" + currentId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleError
    );

    //only for test-purposes
    //test method that you only have to use once
    //only if the database is deleted you have to use the method again
    //there is no need for a success-method because the backend will not send an answer
    const testInfo = useCallFetch("/visuanalytics/infprovtestdatensatz", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, () => {
        }, handleError
    );

    /**
     * helper-method to set the right id and delete the right infoprovider
     * @param id from the infoprovider that has to be deleted
     */
    const handleDeleteButton = (id: number) => {
        console.log("deleteButton" + id);
        setCurrentId(id);
        console.log("visuanalytics/infoprovider/" + currentId)
        deleteInfoProvider();
    }

    return (
        <StepFrame
            heading="Willkommen bei VisuAnalytics!"
            hintContent={hintContents.infoProviderOverview}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <Typography variant={"h5"}>
                            Übersicht definierter Info-Provider
                        </Typography>
                    </Grid>
                    <Grid item container xs={6} justify={"flex-end"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"secondary"}
                                    startIcon={<AddCircleIcon fontSize="small"/>}
                                    onClick={() => components?.setCurrent("createInfoProvider")}>
                                Neuer Info-Provider
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={6} borderRadius={5}
                             className={classes.listFrame}>
                            <InfoProviderList
                                infoprovider={infoprovider}
                                handleDeleteButton={(id: number) => handleDeleteButton(id)}
                            />
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify={"space-evenly"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                Historisierungs-Datenbank
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}
                                onClick={() => testInfo()}>
                                Test-InfoProvider
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
