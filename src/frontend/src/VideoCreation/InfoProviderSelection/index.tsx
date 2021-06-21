import React from "react";
import {fetchAllBackendAnswer, InfoProviderData, MinimalInfoProvider} from "../types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {ListItem, ListItemText} from "@material-ui/core";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useStyles} from "../style";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {InfoProviderFromBackend} from "../../CreateInfoProvider/types";


interface InfoProviderSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProviderList: Array<InfoProviderData>
    selectedInfoProvider: Array<InfoProviderData>
    setSelectedInfoProvider: (selected: Array<InfoProviderData>) => void;
    setMinimalInfoProvObjects: (objects: Array<MinimalInfoProvider>) => void;
    reportError: (message: string) => void;
}


export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();

    // true when the continue button is disabled because a fetching from the backend is currently running
    const [continueDisabled, setContinueDisabled] = React.useState(false);


    // holds all infoProviders that still need to be fetched
    // we use useFetch since we often need to change to value without new rendering
    const infoProviderToFetch= React.useRef<Array<InfoProviderData>>([]);
    // holds all minimal infoProvider fetched so far - necessary since the parent state wont change between fetchesg
    const minimalInfoProvObjects= React.useRef<Array<MinimalInfoProvider>>([]);

    /**
     * Method block for fetching all selected infoproviders from the backend
     */


    /**
     * Fetches the next infoProvider in the list infoProviderToFetch.
     * If there are no more infoProviders, the continue handler is used.
     */
    const fetchNextInfoProvider = () => {
        //when all infoProviders are fetched, proceed to the next component
        if(infoProviderToFetch.current.length === 0) {
            setContinueDisabled(false);
            // copy the local useRef value to the state of the parent
            props.setMinimalInfoProvObjects(minimalInfoProvObjects.current)
            console.log(minimalInfoProvObjects.current)
            props.continueHandler();
        }
        //if not, fetch the next infoProvider
        else fetchInfoProviderById(infoProviderToFetch.current[0].infoprovider_id)
    }

    /**
     * Method that transforms a infoProvider fetched from the backend to a minimal infoProvider
     * only containing the information necessary for video creation.
     * @param infoProvider The infoProvider sent by the backend
     */
    const createMinimalInfoProvider = (infoProvider: InfoProviderFromBackend) => {
        const minimalInfoProvider: MinimalInfoProvider = {
            infoproviderName: infoProvider.infoprovider_name,
            dataSources: []
        }
        infoProvider.datasources.forEach((dataSource) => {
            minimalInfoProvider.dataSources.push({
                apiName: dataSource.datasource_name,
                selectedData: dataSource.selected_data,
                customData: dataSource.formulas,
                historizedData: dataSource.historized_data,
                schedule: {
                    type: dataSource.schedule.type,
                    weekdays: dataSource.schedule.weekdays,
                    time: dataSource.schedule.time,
                    interval: dataSource.schedule.time_interval,
                }
            })
        })
        return minimalInfoProvider;
    }


    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchById = (err: Error) => {
        //console.log('error');
        props.reportError("Fehler: " + err);
        setContinueDisabled(false);
    }


    /**
     * Handles the success of the fetchInfoProviderById()-method.
     * The json from the response will be transformed to a minimal version only
     * containing the necessary information.
     * Also removes the infoProvider from the list infoProviderToFetch.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchById = (jsonData: any) => {
        const data = jsonData as InfoProviderFromBackend;
        //add the transformed minimal infoProvider to the list of the parent component
        const arCopy = minimalInfoProvObjects.current.slice();
        arCopy.push(createMinimalInfoProvider(data));
        minimalInfoProvObjects.current = (arCopy);
        //remove the infoProvider from the list that still needs to be fetched
        infoProviderToFetch.current = infoProviderToFetch.current.filter((infoProvider) => {
            return infoProvider.infoprovider_name !== data.infoprovider_name;
        })
        //console.log("added a new infoprovider");
        //console.log(infoProviderToFetch);
        fetchNextInfoProvider();
    }

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = React.useRef(true);

    /**
     * Method to fetch a infoProvider from the backend by its id.
     * The standard hook "useCallFetch" is not used here since we want to pass an additional parameter 'id'.
     * Setting the id in the state would cause problems making sure the right value is present when needed.
     */
    const fetchInfoProviderById = (id: number) => {
        console.log("called");
        let url = "/visuanalytics/infoprovider/" + id;
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleSuccessFetchById(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorFetchById(err)
        }).finally(() => clearTimeout(timer));
    }

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    /**
     * Method to check if a certain infoProviderID is included in the list of selected infoproviders
     * @param id The id to be checked
     */
    const checkIdIncluded = (id: number) => {
        for (let index = 0; index < props.selectedInfoProvider.length; index++) {
            if(props.selectedInfoProvider[index].infoprovider_id === id) return true;
        }
        return false;
    }

    /**
     * Handler for clicking a checkbox of one of the info providers in the list.
     * Adds the infoProvider to the selection if it is not selected, removes it if it is already selected
     * @param infoProvider The infoProvider the checkbox was clicked for
     */
    const checkBoxHandler = (infoProvider: InfoProviderData) => {
        //check if the infoProvider is already selected
        if(checkIdIncluded(infoProvider.infoprovider_id)) {
            //remove the infoProvider from the selection
            props.setSelectedInfoProvider(props.selectedInfoProvider.filter((selectedInfoProvider) => {
                return selectedInfoProvider.infoprovider_id !== infoProvider.infoprovider_id
            }))
        } else {
            //add the infoProvider to the selection
            const arCopy = props.selectedInfoProvider.slice();
            arCopy.push(infoProvider);
            props.setSelectedInfoProvider(arCopy);
        }
    }

    const renderListItem = (infoProvider: InfoProviderData) => {
        return (
            <ListItem key={infoProvider.infoprovider_id}>
                <ListItemIcon>
                    <Checkbox
                        checked={checkIdIncluded(infoProvider.infoprovider_id)}
                        onChange={() => checkBoxHandler(infoProvider)}
                    />
                </ListItemIcon>
                <ListItemText>
                    {infoProvider.infoprovider_name}
                </ListItemText>
            </ListItem>
        )
    }


    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie die Infoprovider, deren Datenwerte in der Videoerstellung für Text-to-Speech zur Verfügung stehen sollen:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                    <List disablePadding={true}>
                        {props.infoProviderList.map((infoProvider) => renderListItem(infoProvider))}
                    </List>
                </Box>
            </Grid>
            <Grid item xs={12}>
                Warnung
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={continueDisabled || props.selectedInfoProvider.length === 0} variant="contained" size="large" color="primary" onClick={() => {
                       infoProviderToFetch.current = props.selectedInfoProvider;
                       setContinueDisabled(true);
                       fetchNextInfoProvider();
                    }}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
