import React, {ReactElement, useState} from "react";
import {
    AppBar, Box, Grid, IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Tab, Tabs,
    Typography,
} from "@material-ui/core";
import {JobList} from "../JobList";
import {useStyles} from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {ComponentContext} from "../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {ExpandMore} from "@material-ui/icons";
import {PageTemplate} from "../PageTemplate";
import {InfoProviderOverview} from "./TabsContent/InfoProviderOverview/infoProviderOverview";
import {SceneOverview} from "./TabsContent/SceneOverview"
import {VideoOverview} from "./TabsContent/VideoOverview"
import {hintContents} from "../util/hintContents";
import {StepFrame} from "../CreateInfoProvider/StepFrame";

//import {TabPanel} from "@material-ui/lab";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function SimpleTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs centered variant={'fullWidth'} value={value} onChange={handleChange}
                      aria-label="simple tabs example">
                    <Tab label="Info-Provider" {...a11yProps(0)} />
                    <Tab label="Szenen" {...a11yProps(1)} />
                    <Tab label="Videos" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <InfoProviderOverview test={'Info-Provider'}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SceneOverview test={'Szenen'}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <VideoOverview test={'Videos'}/>
            </TabPanel>
        </div>
    );
}

export const Dashboard = () => {
    const classes = useStyles();

    return (
        <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
            <Grid item container xs={12}>
                {SimpleTabs()}
            </Grid>
        </Grid>

    );
};


//Vorher:
/*
<PageTemplate
            heading="Willkommen bei VisuAnalytics!"
            action={{
                title: "Willkommen bei VisuAnalytics",
                Icon: <AddCircleIcon fontSize="large"/>,
                onClick: () => components?.setCurrent("createInfoProvider"),
            }}
            hintContent={
                <div>
                    <Typography variant="h5" gutterBottom>
                        Job-Pool
                    </Typography>
                    <Typography>
                        Auf dieser Seite haben Sie eine Übersicht über die angelegten Jobs.
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon className={classes.hintIcons}>
                                <AddCircleIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Neuen Job erstellen"/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon className={classes.hintIcons}>
                                <EditIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Job bearbeiten"/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon className={classes.hintIcons}>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Job löschen"/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon className={classes.hintIcons}>
                                <ExpandMore/>
                            </ListItemIcon>
                            <ListItemText primary="Job-Informationen ausklappen"/>
                        </ListItem>
                    </List>
                </div>
            }
        >
        <JobList/>
        </PageTemplate>
 */

