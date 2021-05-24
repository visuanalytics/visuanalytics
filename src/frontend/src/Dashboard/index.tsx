import React from "react";
import {
    AppBar, Grid, Tab, Tabs
} from "@material-ui/core";
import {useStyles} from "./style";
import {
    AirplayRounded, CropOriginalRounded, OndemandVideoRounded
} from "@material-ui/icons";
import {InfoProviderOverview} from "./TabsContent/InfoProviderOverview/infoProviderOverview";
import {SceneOverview} from "./TabsContent/SceneOverview/SceneOverview"
import {VideoOverview} from "./TabsContent/VideoOverview/VideoOverview"

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


/**
 * Component to render the content in one tab. Value and index are used to switch correct between all tabs.
 */
export const TabContent: React.FC<TabPanelProps> = (props) => {
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

/**
 * Renders the tabs shown in the dashboard. Main elements are the AppBar that is holding the tabs,
 * the tabs itself and the icons and content shown in one tab
 */
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
                          className={classes.tabs} >
                        <Tab icon={<AirplayRounded/>} label="Info-Provider" className={classes.tabs}/>
                        <Tab icon={<CropOriginalRounded/>} label="Szenen" className={classes.tabs}/>
                        <Tab icon={<OndemandVideoRounded/>} label="Videojobs" className={classes.tabs}/>
                    </Tabs>
                </AppBar>
            </Grid>
            <Grid item xs={12}>
                <TabContent value={value} index={0}>
                    <InfoProviderOverview/>
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

/**
 * Used to put all together and renders dashboard within the other components.
 */
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
