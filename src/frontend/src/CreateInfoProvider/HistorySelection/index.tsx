import React from "react";
import {HistoryDataSelection} from "./HistoryDataSelection";
import {HistoryScheduleSelection} from "./HistoryScheduleSelection";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";
import {DataSource, Schedule, SelectedDataItem} from "..";
import {formelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/formelObj";

interface HistorySelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Array<string>;
    customData: Array<formelObj>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
    schedule: Schedule;
    selectSchedule: (schedule: Schedule) => void;
    historySelectionStep: number;
    setHistorySelectionStep: (step: number) => void;
    apiName: string;
    query: string;
    apiKeyInput1: string;
    apiKeyInput2: string;
    noKey: boolean;
    method: string;
    dataSourceSelectedData: SelectedDataItem[];
    dataSources: DataSource[];
    setDataSources: (dataSources: DataSource[]) => void;
}

/**
 * Component displaying the fourth step in the creation of a new Info-Provider (Historisation).
 * The state of this component handles the input made to its children.
 */
export const HistorySelection: React.FC<HistorySelectionProps>  = (props) => {

    /**
     * Handles clicks on the proceed button in the data selection
     */
    const handleDataProceed = () => {
        props.setHistorySelectionStep(2);
    }

    /**
     * Handles clicks on the back button in time selection
     */
    const handleScheduleBack = () => {
        props.setHistorySelectionStep(1);
    }

    /**
     * Adds a new data source to the state of the Infoprovider.
     * If a data source already exists, it will be swapped out when this method is called.
     */
    const addToDataSources = () => {
        const dataSource: DataSource = {
            apiName: props.apiName,
            query: props.query,
            apiKeyInput1: props.apiKeyInput1,
            apiKeyInput2: props.apiKeyInput2,
            noKey: props.noKey,
            method: props.method,
            selectedData: props.dataSourceSelectedData,
            customData: props.customData,
            historizedData: props.historizedData,
            schedule: props.schedule
        };
        for(let i = 0; i < props.dataSources.length; i++) {
            if (props.dataSources[i].apiName === props.apiName) {
                let newDataSources = props.dataSources.slice();
                newDataSources[i] = dataSource;
                props.setDataSources(newDataSources);
                return;
            }
        }
        props.setDataSources(props.dataSources.concat(dataSource));
    }

    /**
     * When the user doesn't select any values to be historized, this continue handler will be called and add the current data source to the other data sources.
     * After that the handler will proceed to the next step of the Infoprovider
     */
    const skipContinueHandler = () => {
        addToDataSources();
        props.continueHandler();
    }


    //const components = React.useContext(ComponentContext);
    /**
     * Renders content based on the current historySelectionStep
     */
    const getContent = () => {
        switch (props.historySelectionStep) {
            case 1:
                return (
                    <HistoryDataSelection
                        handleProceed={handleDataProceed}
                        handleSkipProceed={skipContinueHandler}
                        handleBack={props.backHandler}
                        selectedData={props.selectedData}
                        customData={props.customData}
                        historizedData={props.historizedData}
                        setHistorizedData={props.setHistorizedData}
                        selectSchedule={props.selectSchedule}
                    />
                )
            case 2:
                return (
                    <HistoryScheduleSelection
                        handleProceed={props.continueHandler}
                        handleBack={handleScheduleBack}
                        schedule={props.schedule}
                        selectSchedule={props.selectSchedule}
                        addToDataSources={addToDataSources}
                    />
                )

        }
    }

    return (
        <StepFrame
            heading = "Historisierung"
            hintContent = {hintContents.historySelection}
        >
            {getContent()}
        </StepFrame>
    )

};
