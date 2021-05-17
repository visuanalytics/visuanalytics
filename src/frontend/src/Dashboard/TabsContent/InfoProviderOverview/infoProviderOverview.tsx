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

 export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

type requestBackendAnswer = Array<jsonRef>

export const InfoProviderOverview: React.FC = () => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    const [infoprovider, setInfoProvider] = React.useState(new Array<jsonRef>());

    const [currentId, setCurrentId] = React.useState(0);

    React.useEffect(() => {
            getAll();
        }, []
    );

    const handleSuccessGetAll = (jsonData: any) => {
        const data = jsonData as requestBackendAnswer;
        setInfoProvider(data);
    }

    const handleSuccessDelete = (jsonData: any) => {

        for (let i: number = 0; i <= infoprovider.length; i++) {
            if (infoprovider[i].infoprovider_id === currentId) {
                const arCopy = infoprovider.slice();
                arCopy.splice(i, 1);
                setInfoProvider(arCopy);
                alert('true');
                return
            }
        }
    }

    const handleError = (err: Error) => {
        console.log('error');
        alert('Fehler! : ' + err);
    }

    const getAll = useCallFetch("/visuanalytics/infoprovider/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessGetAll, handleError
    );

    const deleteInfoProvider = useCallFetch("/visuanalytics/infoprovider/<" + currentId + ">", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccessDelete, handleError
    );

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

    const handleDeleteButton = (id: number) => {
        setCurrentId(id);
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
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
