import {
  ArrayProcessingData,
  Schedule,
  SelectedDataItem,
  StringReplacementData,
} from "../CreateInfoProvider/types";
import { FormelObj } from "../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

/**
 * Type containing all directions a sceneCard can be moved to.
 */
export enum Direction {
  Left = "LEFT",
  Right = "RIGHT",
}

/**
 * Type representing the data of a single scene selected by the user to be displayed
 * in the video. Named "sceneCard" since the selection is shown as a row of cards.
 */
export type SceneCardData = {
  entryId: string;
  sceneName: string;
  exceedDisplayDuration: number;
  spokenText: Array<AudioElement>;
  visible: boolean;
};

/**
 * Type of a infoprovider as it is returned by the route /infoprovider/all
 */
export type InfoProviderData = {
  infoprovider_id: number;
  infoprovider_name: string;
};

// type of the answer for fetching all Infoprovider from Backend
export type FetchAllInfoProviderAnswer = Array<InfoProviderData>;

/**
 * Type of a scene as it is returned by the route /scene/all
 */
export type SceneData = {
  scene_id: number;
  scene_name: string;
};

// type of the answer for fetching all Infoprovider from Backend
export type FetchAllScenesAnswer = Array<SceneData>;

export type MinimalDataSource = {
  apiName: string;
  selectedData: SelectedDataItem[];
  customData: FormelObj[];
  historizedData: string[];
  schedule: Schedule;
  arrayProcessingList: Array<ArrayProcessingData>;
  stringReplacementList: Array<StringReplacementData>;
};

/**
 * Reduced version of a infoprovider that only contains its name, all dataSources
 * with name, selectedData, customData, historizedData and the schedule object.
 * This ist only the data used in VideoEditor and is needed to save memory when potentially
 * many infoProvider are being loaded/stored at the same time.
 */
export type MinimalInfoProvider = {
  infoproviderName: string;
  dataSources: Array<MinimalDataSource>;
};

/**
 * This type is needed to limit the types of a audio element to only the specified ones.
 * text: Any text the user wants to be spoken by a TTS
 * pause: The pause that should be between to different audios
 */
export type AudioType = "text" | "pause";

/**
 * This type represents one element for the audio for a scene
 * An element can only contain one type.
 * So currently a audio part can be a pause or a text spoken by the TTS
 */
export type AudioElement = {
  type: AudioType;
  text?: string;
  duration?: number;
};

/**
 * Type of a single audio used to send to the backend.
 * Always contains a type, and depending on it either a pattern/text or a duration.
 */
export type BackendAudioType = {
  type: "text" | "silent";
  pattern?: string;
  duration?: number;
};
