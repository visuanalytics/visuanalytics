import React from "react";
import { Schedule } from "./schedule";
import { DeleteSchedule } from "./deleteSchedule";
import { Tab, Tabs } from "@material-ui/core";
import { ScheduleSelection } from "../JobCreate/ScheduleSelection";
import { DeleteSelection } from "../JobCreate/DeleteSelection";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TabContext, TabPanel } from "@material-ui/lab";
import { ParamSelectionProps, ParamSelection } from "../JobCreate/ParamSelection";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tabs: {
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            color: '#00638D'
        },
        tabPanel: {
            padding: '0 24px'
        },
        tabPanelParams: {
            padding: "0px"
        }
    })
);

interface Props {
    offset: number
    schedule: Schedule
    deleteSchedule: DeleteSchedule
    selectScheduleHandler: (schedule: Schedule) => void;
    selectDeleteScheduleHandler: (deleteSchedule: DeleteSchedule) => void;
    handleHintState: (hintState: number) => void;
    paramSelectionProps: ParamSelectionProps | undefined
}

export const SettingsPage: React.FC<Props> = ({ offset, schedule, deleteSchedule, selectScheduleHandler, selectDeleteScheduleHandler, handleHintState, paramSelectionProps }) => {
    const classes = useStyles();

    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        handleHintState(Number(newValue) + offset)
        setValue(newValue);
    };

    return (
        <div>
            <TabContext value={value}>
                <Tabs
                    classes={{ root: classes.tabs }}
                    value={value}
                    onChange={handleChange}
                    centered
                    indicatorColor={'secondary'}
                    variant="fullWidth"
                >
                    <Tab label="Generieren" value="1" />
                    <Tab label="Löschen" value="2" />
                    {paramSelectionProps && (<Tab label="Parameter" value="3" />)}

                </Tabs>
                <TabPanel value={"1"} className={classes.tabPanel}>
                    <ScheduleSelection
                        schedule={schedule}
                        selectScheduleHandler={selectScheduleHandler}
                    />
                </TabPanel>
                <TabPanel value={"2"} className={classes.tabPanel}>
                    <DeleteSelection
                        deleteSchedule={deleteSchedule}
                        selectDeleteScheduleHandler={selectDeleteScheduleHandler}
                    />
                </TabPanel>
                {paramSelectionProps && (
                    <TabPanel value={"3"} className={classes.tabPanelParams}>
                        <ParamSelection
                            topicNames={paramSelectionProps.topicNames}
                            values={paramSelectionProps.values}
                            params={paramSelectionProps.params}
                            loadFailedProps={paramSelectionProps.loadFailedProps}
                            selectParamHandler={paramSelectionProps.selectParamHandler}
                            invalidValues={paramSelectionProps.invalidValues}
                        />
                    </TabPanel>)}
            </TabContext>
        </div>
    )
}