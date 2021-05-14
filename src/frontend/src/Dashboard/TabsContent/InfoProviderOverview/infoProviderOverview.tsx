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

interface InfoProviderOverviewProps {
    test: string;
}

type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

type requestBackendAnswer = Array<jsonRef>

export const InfoProviderOverview: React.FC<InfoProviderOverviewProps> = (props) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    const [infoprovider, setInfoProvider] = React.useState(new Array<string>());

    const handleSuccess = (jsonData: any) => {
        const data = jsonData as requestBackendAnswer;
        const newArray = new Array<string>();

        data.forEach(item => {
            newArray.push(item.infoprovider_name)
        });

        setInfoProvider(newArray);
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
        }, handleSuccess, handleError
    );

    //test method that you only have to use once
    //only if the database is deleted you have to use the method again
    const testInfo = useCallFetch("/visuanalytics/infprovtestdatensatz", {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            }
        }, handleSuccess, handleError
    );


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
                        <Box borderColor="primary.main" border={4} borderRadius={5}
                             className={classes.listFrame}>
                            <InfoProviderList
                                infoprovider={infoprovider}
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
                                    onClick={() => getAll()}>
                                getAll
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}>
                                test
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
