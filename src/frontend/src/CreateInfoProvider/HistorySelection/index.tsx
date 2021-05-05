import React from "react";
import {HistoryDataSelection} from "./HistoryDataSelection";
import {HistoryScheduleSelection} from "./HistoryScheduleSelection";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";


interface HistorySelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Array<string>;
    customData: Array<any>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
};

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const HistorySelection: React.FC<HistorySelectionProps>  = (props) => {
    //represents the current step: 1 is data selection, 2 is time selection
    const [step, setStep] = React.useState(1);

    /**
     * Handles clicks on the proceed button in the data selection
     */
    const handleDataProceed = () => {
        setStep(2);
    }

    /**
     * Handles clicks on the back button in time selection
     */
    const handleScheduleBack = () => {
        setStep(1);
    }


    //const components = React.useContext(ComponentContext);
    /**
     * Renders content based on the current step
     */
    const getContent = () => {
        switch (step) {
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
