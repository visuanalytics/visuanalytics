import React, {useState} from "react";
import List from "@material-ui/core/List";
import {ListItem} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {DataSource} from "../../CreateInfoProvider";
import {useStyles} from "../style";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";

interface SceneEditorProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProvider: Array<DataSource>;
}

export const SceneEditor: React.FC<SceneEditorProps> = (props) => {

    //TODO: only for debugging purposes, remove in production
    const testDataList = ["data1", "data2", "data3", "data4"]

    const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const [dataList, setDataList] = React.useState<Array<string>>([]);

    //TODO: load dataList from the infoProvider props

    /**
     * Method to handle the selection of data from the list of available api data.
     * @param item The item selected by the user
     */
    const handleItemSelect = (item: string) => {
        //TODO: add the selected item to the canvas
        console.log("user selected item " + item)
    }

    /**
     * Method that renders the list items to be displayed in the list of all available data.
     * @param item The item to be displayed
     */
    const renderListItem = (item: string) => {
        return (
            <ListItem key={item}>
                <Button onClick={() => handleItemSelect(item)}>
                    {item}
                </Button>
            </ListItem>
        )
    }

    return (
        <StepFrame
            heading={"Szenen-Editor"}
            hintContent={hintContents.typeSelection}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <List disablePadding={true}>
                            {dataList.map((item) => renderListItem(item))}
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => setDataList(testDataList)}>
                        Testdaten
                    </Button>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
