import React from "react";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {formelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

interface InfoProviderListProps {
   // infoprovider: Array<JSON>;
    //setInfoprovider: (data: Array<JSON>) => void;
}


export const InfoProviderList: React.FC<InfoProviderListProps> = (props) => {


    const renderListItem = (data: JSON) => {
        return (
            <ListItem key={JSON.stringify(data)}>
                {JSON.stringify(data)}
            </ListItem>
        );
    };

    return(
        <List>
            1
        </List>
    );
}
