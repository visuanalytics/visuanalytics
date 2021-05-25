import React from "react";
import {useStyles} from "../style";
import {Box, List, ListItem, Typography} from "@material-ui/core";
import {formelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";

interface FormelListProps {
    customDataEdit: Array<formelObj>
}

export const FormelList: React.FC<FormelListProps> = (props) => {

    const classes = useStyles;

    const renderListItem = (data: formelObj) => {
        return (
           <ListItem>
               <Typography>
                   {data.formelName}
               </Typography>
               <Box border={5} borderRadius={10}>
                   <Typography variant={"h5"}>
                       {data.formelString}
                   </Typography>
               </Box>
           </ListItem>
        );
    }

    return(
        <List>
            {props.customDataEdit.map((e) => renderListItem(e))}
        </List>
    );
}
