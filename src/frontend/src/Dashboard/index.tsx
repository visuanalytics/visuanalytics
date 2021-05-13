import React, {ReactElement, useState} from "react";
import {
    AppBar, Box, Grid, IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Tab, Tabs,
    Typography,
} from "@material-ui/core";
import {useStyles} from "./style";
import {
    AirplayRounded, CropOriginalRounded, OndemandVideoRounded
} from "@material-ui/icons";
import {InfoProviderOverview} from "./TabsContent/InfoProviderOverview/infoProviderOverview";
import {SceneOverview} from "./TabsContent/SceneOverview"
import {VideoOverview} from "./TabsContent/VideoOverview"

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

export const TabContent = (props: TabPanelProps) => {
    const {children, value, index} = props;

    return (
        <Grid item>
            {value === index && (
                <Grid item>
                    {children}
                </Grid>
            )}
        </Grid>
    );
}

export const DashboardTabs = () =>  {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid item xs={12}>
            <Grid item container xs={12} justify={"center"}>
                <AppBar position="static" className={classes.tab}>
                    <Tabs centered variant={'fullWidth'} value={value} onChange={handleChange}
                          aria-label="simple tabs example"
                          className={classes.test} >
                        <Tab icon={<AirplayRounded/>} label="Info-Provider" className={classes.test}/>
                        <Tab icon={<CropOriginalRounded/>} label="Szenen" className={classes.test}/>
                        <Tab icon={<OndemandVideoRounded/>} label="Videos" className={classes.test}/>
                    </Tabs>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <TabContent value={value} index={0}>
                    <InfoProviderOverview test={'Info-Provider'}/>
                </TabContent>
            </Grid>
            <Grid item xs={12}>
                <TabContent value={value} index={1}>
                    <SceneOverview test={'Szenen'}/>
                </TabContent>
            </Grid>
            <Grid item xs={12}>
                <TabContent value={value} index={2}>
                    <VideoOverview test={'Videos'}/>
                </TabContent>
            </Grid>
        </Grid>
    );
}

export const Dashboard = () => {
    const classes = useStyles();

    return (
        <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
            <Grid item container xs={12}>
                {DashboardTabs()}
            </Grid>
        </Grid>

    );
};
