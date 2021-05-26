import React from "react";
import { useStyles } from "../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import {DataSource, DataSourceKey, selectionElement, uniqueId} from "../types";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {APIInputField} from "../BasicSettings/APIInputField/APIInputField";

interface AuthDataDialogProps {
    authDataDialogOpen: boolean;
    setAuthDataDialogOpen: (open: boolean) => void;
    method: string;
    noKey: boolean;
    apiKeyInput1: string;
    setApiKeyInput1: (input: string) => void;
    apiKeyInput2: string;
    setApiKeyInput2: (input: string) => void;
    dataSources: Array<DataSource>;
    dataSourcesKeys: Map<string, DataSourceKey>;
    setDataSourcesKeys: (map: Map<string, DataSourceKey>) => void;
    selectionDataSources: Array<selectionElement>;
}



/**
 * Component containing the dialog for restoring authentication data on reload
 */
//TODO: add this to the documentation
export const AuthDataDialog: React.FC<AuthDataDialogProps>  = (props) => {
    const classes = useStyles();


        //TODO: check were undefined check is needed and where not
    //TODO: clean up

    //the currently selected index of the buildChoiceArray
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    /**
     * Method to construct an array of all dataSources names where the user needs to re-enter his authentication data.
     */
    const buildDataSourceSelection = () => {
        const dataSourceSelection: Array<selectionElement> = [];
        //check the current data source and add it as an option
        if(!props.noKey) {
            dataSourceSelection.push({
                name: "current--"+ uniqueId,
                method: props.method
            })
        }
        //check all other data sources
        if(props.dataSources!==undefined) {
            props.dataSources.forEach((dataSource) => {
                //input is necessary if any method of authentication is being used
                if(!dataSource.noKey) dataSourceSelection.push({
                    name: dataSource.apiName,
                    method: dataSource.method
                })
            })
        }
        console.log(dataSourceSelection)
        return dataSourceSelection
    }

    //const [selectionDataSources, setSelectionDataSources] = React.useState<Array<selectionElement>>([])

/*
    React.useEffect(() => {
        setSelectionDataSources(buildDataSourceSelection())
    }, [])
*/

    /**
     * Method to check if the user has put in everything necessary and is ready to close the dialog.
     */
    const checkFinish = () => {
        return true;
    }

    const handleDataSourceChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setSelectedIndex(Number(event.target.value));
    }


    const handleInputChange = (field: number, value: string) => {
        if(props.selectionDataSources[selectedIndex]!==undefined&&value!==undefined) {
            if(field===1) {
                if(props.selectionDataSources[selectedIndex].name==="current--" + uniqueId) props.setApiKeyInput1(value);
                else {
                    const mapCopy = new Map(props.dataSourcesKeys);
                    if(mapCopy.get(props.selectionDataSources[selectedIndex].name)!==undefined) {
                        mapCopy.set(props.selectionDataSources[selectedIndex].name, {
                            apiKeyInput1: value,
                            apiKeyInput2: mapCopy.get(props.selectionDataSources[selectedIndex].name)!.apiKeyInput2
                        });
                        props.setDataSourcesKeys(mapCopy);
                    }
                }
            } else if(field===2) {
                if(props.selectionDataSources[selectedIndex].name==="current--" + uniqueId) props.setApiKeyInput2(value);
                else {
                    const mapCopy = new Map(props.dataSourcesKeys);
                    if(mapCopy.get(props.selectionDataSources[selectedIndex].name)!==undefined) {
                        mapCopy.set(props.selectionDataSources[selectedIndex].name, {
                            apiKeyInput1: mapCopy.get(props.selectionDataSources[selectedIndex].name)!.apiKeyInput1,
                            apiKeyInput2: value
                        });
                        props.setDataSourcesKeys(mapCopy);

                    }
                }
            }
        }
    }



    const renderDataSourceOption = (dataSource: string, dataSourceNumber: number) => {
        console.log(props.dataSourcesKeys)
        if(dataSource!==undefined) {
            return (
                <MenuItem key={dataSource} value={dataSourceNumber}>{(dataSource.includes(uniqueId))?"aktuelle Datenquelle":(dataSource)}</MenuItem>
            )
        } else {
            return (
                <React.Fragment></React.Fragment>
            )
        }

    }

    //TODO: resolve method names for correct displaying
    return (
        <Dialog aria-labelledby="authDataDialog-title"
                open={props.authDataDialogOpen}>
            <DialogTitle id="authDataDialog-title">
                Authentifizierungsdaten wiederherstellen
            </DialogTitle>
            <DialogContent dividers>
                <Grid container>
                    <Grid item xs={12}>
                        Erneute Eingabe der Authentifizierungsdaten ist auch Sicherheitsgründen notwendig. Bitte geben sie für alle angezeigten Datenquellen ihre Authentifizierungsdaten erneut ein.<br/>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <FormControl fullWidth>
                            <InputLabel id="select-dataSource-dropDown">Wahl der Datenquelle</InputLabel>
                            <Select value={selectedIndex} onChange={handleDataSourceChange}>
                                {props.selectionDataSources.map((item, index) => renderDataSourceOption(item.name, index))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} className={classes.elementLargeMargin}>
                        <Typography variant="body1">
                            Authentifizierungsmethode dieser Datenquelle: <strong>{props.selectionDataSources[selectedIndex].method}</strong>
                        </Typography>
                    </Grid>
                    <Grid item container xs={12} justify="space-between">
                        <Grid item xs={props.selectionDataSources[selectedIndex].method==="BearerToken"?12:5}>
                            <APIInputField
                                defaultValue={(props.selectionDataSources[selectedIndex].method==="BasicAuth"||props.selectionDataSources[selectedIndex].method==="DigestAuth")?"Nutzername":props.selectionDataSources[selectedIndex].method==="BearerToken"?"Token":"Name Key-Parameter"}
                                //undefined is not possible here since buildDataSourceSelection set all map entries to empty strings as default
                                value={(props.selectionDataSources[selectedIndex].name==="current--"+uniqueId)?props.apiKeyInput1:props.dataSourcesKeys.get(props.selectionDataSources[selectedIndex].name)!.apiKeyInput1}
                                changeHandler={(s) => handleInputChange(1, s)}
                                noKey={false}
                            />
                        </Grid>
                        {props.selectionDataSources[selectedIndex].method !== "BearerToken" &&
                            <Grid item xs={6}>
                                <APIInputField
                                    defaultValue={(props.selectionDataSources[selectedIndex].method==="BasicAuth" || props.selectionDataSources[selectedIndex].method==="DigestAuth") ? "Passwort" : "API-Key"}
                                    //undefined is not possible here since buildDataSourceSelection set all map entries to empty strings as default
                                    value={(props.selectionDataSources[selectedIndex].name==="current--"+uniqueId)?props.apiKeyInput2:props.dataSourcesKeys.get(props.selectionDataSources[selectedIndex].name)!.apiKeyInput2}
                                    changeHandler={(s) => {
                                        handleInputChange(2, s)
                                    }}
                                    noKey={props.selectionDataSources[selectedIndex].method==="BearerToken"}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button variant="contained" color="primary" disabled={!checkFinish()} onClick={() => console.log("finished")}>
                        Bestätigen
                    </Button>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};
