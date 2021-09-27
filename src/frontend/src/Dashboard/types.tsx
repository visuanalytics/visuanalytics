import {
  CustomCircle,
  CustomImage,
  CustomLine,
  CustomRectangle,
  CustomStar,
  CustomText,
  DataImage,
  DataText,
} from "../SceneCreation/SceneEditor/types";
import { SceneCardData } from "../VideoCreation/types";
import { FrontendInfoProvider } from "../CreateInfoProvider/types";
import { InfoProviderData } from "../SceneCreation/types";

export type jsonRef = {
  infoprovider_id: number;
  infoprovider_name: string;
};

/**
 * This type is needed because the answer of the backend consists of a list of jsonRef's.
 */
export type fetchAllBackendAnswer = Array<jsonRef>;

export type BackendVideo = {
  videojob_id: number;
  videojob_name: string;
};

export type BackendVideoList = Array<BackendVideo>;

//bisher nur zum testen verwendet.
export type answer = {
  err_msg: string;
};

export type LogEntry = {
  object_id: string;
  object_name: string;
  state: number;
  errorMsg: string;
  errorTraceback: string;
  duration: string;
  startTime: string;
};

/**
 * Data type representing a scene as it was sent from the backend.
 */
export type BackendScene = {
  scene_id: number;
  scene_name: string;
};

/**
 * Data type representing the answer the backend delivers on the route
 * /scene/all
 */
export type FetchAllScenesAnswer = Array<BackendScene>;

/**
 * Represents a single preview image for a scene - contains the URL of the image
 * and its id.
 */
export type PreviewImage = {
  URL: string;
  id: number;
};

/**
 * Represents all information of one single scene fetched from the backend.
 */
export type FullScene = {
  name: string;
  used_images: Array<number>;
  used_infoproviders: Array<number>;
  images: ImagesBackend;
  backgroundImage: number;
  backgroundType: string;
  backgroundColor: string;
  backgroundColorEnabled: boolean;
  itemCounter: number;
  scene_items: Array<
    | CustomCircle
    | CustomRectangle
    | CustomLine
    | CustomStar
    | CustomText
    | CustomImage
  >;
  infoProvider?: FrontendInfoProvider;
};

export type ImagesBackend = {
  type: string;
  path: string;
  overlay: Array<DataImage | DataText>;
};

/**
 * Represents all information of one single video fetched from the backend.
 */
export type FullVideo = {
  audio: any;
  images: any;
  name: string;
  sceneList: Array<SceneCardData>;
  schedule: {
    type: string;
    time: string;
    date: string;
    time_interval: string;
    weekdays: Array<number>;
  };
  selectedInfoprovider: Array<InfoProviderData>;
  sequence: any;
  tts_ids: Array<number>;
  video_name: string;
};
