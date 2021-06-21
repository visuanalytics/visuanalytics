import {
    DataSource,
    DataSourceKey,
    Diagram,
    ListItemRepresentation,
    Schedule,
    SelectedDataItem
} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

export enum Direction {
    Left = "LEFT",
    Right = "RIGHT"
}

export type DurationType = "fixed" | "exceed"

export type SceneCardData = {
    entryId: string;
    sceneName: string;
    durationType: DurationType;
    fixedDisplayDuration: number;
    exceedDisplayDuration: number;
    spokenText: string;
    visible: boolean;
}

export type InfoProviderData = {
    infoprovider_id: number;
    infoprovider_name: string;
}


// type of the answer for fetching all Infoprovider from Backend
export type fetchAllBackendAnswer = Array<InfoProviderData>

/**
 * Reduced version of a infoprovider that only contains its name, all dataSources
 * with name, selectedData, customData, historizedData and the schedule object.
 * This ist only the data used in VideoEditor and is needed to save memory when potentially
 * many infoProvider are being loaded/stored at the same time.
 */
export type MinimalInfoProvider = {
    infoproviderName: string;
    dataSources: Array<{
        apiName: string;
        selectedData: SelectedDataItem[];
        customData: FormelObj[];
        historizedData: string[];
        schedule: Schedule;
    }>;
}

