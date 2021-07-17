/* InfoProviderOverview

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
import {DataImage, DataText} from "../SceneCreation/SceneEditor/types";

export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * This type is needed because the answer of the backend consists of a list of jsonRef's.
 */
export type fetchAllBackendAnswer = Array<jsonRef>

export type BackendVideo = {
    videojob_id: number;
    videojob_name: string;
}

export type BackendVideoList = Array<BackendVideo>;

//bisher nur zum testen verwendet.
export type answer = {
    err_msg: string;
}


export type LogEntry = {
    datasource_id: string;
    datasource_name: string;
    state: string;
    errorMsg: string;
    errorTraceback: string;
    duration: string;
    startTime: string;
}

/**
 * Data type representing a scene as it was sent from the backend.
 */
export type BackendScene = {
    scene_id: number;
    scene_name: string;
}

/**
 * Data type representing the answer the backend delivers on the route
 * /scene/all
 */
export type FetchAllScenesAnswer = Array<BackendScene>

/**
 * Represents a single preview image for a scene - contains the URL of the image
 * and its id.
 */
export type PreviewImage = {
    URL: string;
    id: number;
}

/**
 * Represents all information of one single scene fetched from the backend.
 */
export type FullScene = {
    scene_name: string;
    used_images: Array<number>;
    used_infoproviders: Array<number>;
    images: ImagesBackend;
    backgroundImage: number;
    backgroundType: string;
    backgroundColor: string;
    backgroundColorEnabled: boolean;
    itemCounter: number;
    scene_items: string;
}

export type ImagesBackend = {
    type: string;
    path: string;
    overlay: Array<DataImage | DataText>
}
