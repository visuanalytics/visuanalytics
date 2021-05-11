import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {ListItemRepresentation, diagramType} from "../../index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import {BasicDiagramSettings} from "../BasicDiagramSettings";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {CustomLabels} from "../CustomLabels";

interface ArrayDiagramCreatorProps {
    continueHandler: () => void;
    backHandler: () => void;
    currentArray: ListItemRepresentation;
    arrayNumericAttribute: string;
    setArrayNumericAttribute: (attribute: string) => void;
    arrayStringAttribute: string;
    setArrayStringAttribute: (attribute: string) => void;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    amount: number;
    setAmount: (amount: number) => void;
    reportError: (message: string) => void;
    labelArray: Array<string>
    setLabelArray: (array: Array<string>) => void;
}

export const ArrayDiagramCreator: React.FC<ArrayDiagramCreatorProps> = (props) => {
    const classes = useStyles();

    //Holds all attributes that are numeric and can be used as data for the diagram
    const [numericAttributes, setNumericAttributes] = React.useState<Array<ListItemRepresentation>>([])
    //Holds all attributes that are strings/text and can be used as the diagram text
    const [stringAttributes, setStringAttributes] = React.useState<Array<ListItemRepresentation>>([])
    //true when the user has selected to use custom labels
    const [customLabels, setCustomLabels] = React.useState(false);

    React.useEffect(() => {
        //console.log(props.currentArray);
        if(Array.isArray(props.currentArray.value)) {
            setNumericAttributes(getNumericAttributes(props.currentArray.value));
            setStringAttributes(getStringAttributes(props.currentArray.value))
        }
    }, [props.currentArray])


    /**
     * Handler for the return of a successful call to the backend (posting test diagram)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {
    }

    /**
     * Handler for unsuccessful call to the backend (posting test-diagram)
     * @param err The error returned by the backend
     */
    const handleError = (err: Error) => {
        props.reportError("Fehler: Senden des Diagramms an das Backend fehlgeschlagen! (" + err.message + ")");
    }

    /**
     * Method to post all settings for the Info-Provider made by the user to the backend.
     * The backend will use this data to create the desired Info-Provider.
     */
    const getTestImage = useCallFetch("/testdiagram",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

            })
        }, handleSuccess, handleError
    );


    /**
     * Used for arrays that contain objects. Returns all attributes that are numeric to present them as a choice to the user.
     * @param object The object contained in the array.
     */
    const getNumericAttributes = (object: Array<ListItemRepresentation>) => {
        const numericAttributes: Array<ListItemRepresentation> = []
        for(let index = 0; index < object.length; ++index) {
            //console.log("checking: " + object[index].keyName);
            if(object[index].value==="Zahl") numericAttributes.push(object[index]);
        }
        return numericAttributes;
    }

    /**
     * Used for arrays that contain objects. Returns all attributes that are strings/text to present them as a choice to the user.
     * @param object The object contained in the array.
     */
    const getStringAttributes = (object: Array<ListItemRepresentation>) => {
        const stringAttributes: Array<ListItemRepresentation> = []
        for(let index = 0; index < object.length; ++index) {
            //console.log("checking: " + object[index].keyName);
            if(object[index].value==="Text") stringAttributes.push(object[index]);
        }
        return stringAttributes;
    }

    /**
     * Event handler that is called when the numeric attribute choice is changed.
     * @param event The change event caused by changing the attribute.
     */
    const numericAttributeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setArrayNumericAttribute(event.target.value);
    };
    /**
     * Event handler that is called when the string attribute choice is changed.
     * @param event The change event caused by changing the attribute.
     */
    const stringAttributeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setArrayStringAttribute(event.target.value);
    };


    /**
     * Renders an item to be displayed in the list of numeric attributes.
     * @param item The item to be displayed
     * Will not display the full path since the names are unique within one object.
     */
    const renderAttributeListItem = (item: ListItemRepresentation) => {
        return (
            <FormControlLabel value={item.keyName} control={
                <Radio
                />
            } label={item.keyName} key={item.keyName}
            />
        )
    }


    /**
     * Used for arrays with objects. Returns the currently selected label selection based on the state.
     * If the user has selected customLabels, then the input is offered, if not, the list of string attributes is displayed.
     */
    const getLabelSelection = () => {
        if(customLabels) {
            return (
                <Grid item container xs={6}>
                    <CustomLabels
                        amount={props.amount}
                        labelArray={props.labelArray}
                        setLabelArray={props.setLabelArray}
                    />
                </Grid>
            )
        } else {
            return (
                <Grid item xs={6}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <FormControl>
                            <RadioGroup onChange={stringAttributeChangeHandler}>
                                {stringAttributes.map((item) => renderAttributeListItem(item))}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
            )
        }
    }


    /**
     * Renders the currently necessary detailed selection by checking if the selected array contains objects or primitives
     */
    const renderSelections = () => {
        if(Array.isArray(props.currentArray.value)) {
            //selections for arrays containing objects
            return (
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Bitte wählen sie das Zahl-Attribut zur Darstellung im Diagramm:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            {customLabels?"Bitte wählen sie zu jedem Wert eine Beschriftung:":"Bitte wählen sie das String-Attribut zur Beschriftung der Werte:"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                <FormControl>
                                    <RadioGroup onChange={numericAttributeChangeHandler}>
                                        {numericAttributes.map((item) => renderAttributeListItem(item))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                    </Grid>
                    {getLabelSelection()}
                </Grid>
            )
        } else {
            //selections for arrays containing primitives
            return (
                <CustomLabels
                    amount={props.amount}
                    labelArray={props.labelArray}
                    setLabelArray={props.setLabelArray}
                />
            )
        }
    }

    return(
        <Grid container justify="space-between">
            <BasicDiagramSettings
                currentArray={props.currentArray}
                diagramType={props.diagramType}
                setDiagramType={props.setDiagramType}
                amount={props.amount}
                setAmount={props.setAmount}
            />
            {renderSelections()}
            <Grid item container xs={12} justify="space-around">
                <Grid item>
                    <Button variant="contained" size="large" color="secondary" onClick={() => getTestImage()}>
                        Vorschau generieren
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => setCustomLabels(!customLabels)}>
                        {customLabels?"Attribut-Beschriftung":"eigene Beschriftungen"}
                    </Button>
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button variant="contained" size="large" color="primary"  onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
