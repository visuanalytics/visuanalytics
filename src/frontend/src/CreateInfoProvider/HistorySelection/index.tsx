import React from "react";
import {HistoryDataSelection} from "./HistoryDataSelection";
import {HistoryScheduleSelection} from "./HistoryScheduleSelection";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";
import { Schedule } from "..";
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
                        handleSkipProceed={props.continueHandler}
                        handleBack={props.backHandler}
                        selectedData={props.selectedData}
                        customData={props.customData}
                        historizedData={props.historizedData}
                        setHistorizedData={props.setHistorizedData}
                    />
                )
            case 2:
                return (
                    <HistoryScheduleSelection
                        handleProceed={props.continueHandler}
                        handleBack={handleScheduleBack}
                        schedule={props.schedule}
                        selectSchedule={props.selectSchedule}
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
