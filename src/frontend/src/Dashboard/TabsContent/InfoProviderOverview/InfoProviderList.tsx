import React from "react";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {formelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {Box, List, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import {useStyles} from "../../style";

interface InfoProviderListProps {
    infoprovider: Array<string>;
    //setInfoprovider: (data: Array<string>) => void;
}


export const InfoProviderList: React.FC<InfoProviderListProps> = (props) => {

    const classes = useStyles();

    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                <Box border={3} borderRadius={10}
                     className={classes.infoProvBorder}>
                    <Typography>
                        {data}
                    </Typography>
                </Box>
            </ListItem>
        );
    };

    return(
        <List>
            {props.infoprovider.map((e) => renderListItem(e))}
        </List>
    );
}
