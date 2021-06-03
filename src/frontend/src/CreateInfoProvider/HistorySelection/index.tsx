import React from "react";
import {HistoryDataSelection} from "./HistoryDataSelection";
import {HistoryScheduleSelection} from "./HistoryScheduleSelection";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {Diagram, Schedule} from "../types";

interface HistorySelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Array<string>;
    customData: Array<FormelObj>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
    schedule: Schedule;
    selectSchedule: (schedule: Schedule) => void;
    historySelectionStep: number;
    setHistorySelectionStep: (step: number) => void;
    addToDataSources: () => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    apiName: string;
}

/**
 * Component displaying the fourth step in the creation of a new Info-Provider (Historization).
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
     * When the user doesn't select any values to be historized, this continue handler will be called and add the current data source to the other data sources.
     * After that the handler will proceed to the next step of the Infoprovider
     */
    const skipContinueHandler = () => {
        props.addToDataSources();
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
                        diagrams={props.diagrams}
                        setDiagrams={props.setDiagrams}
                        apiName={props.apiName}
                    />
                )
            case 2:
                return (
                    <HistoryScheduleSelection
                        handleProceed={props.continueHandler}
                        handleBack={handleScheduleBack}
                        schedule={props.schedule}
                        selectSchedule={props.selectSchedule}
                        addToDataSources={props.addToDataSources}
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
