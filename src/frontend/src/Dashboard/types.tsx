/* InfoProviderOverview

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
import {Diagram} from "../CreateInfoProvider/types";

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
    object_id: string;
    object_name: string;
    state: number;
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

export type FullScene = {
    scene_name: string;
    used_images: Array<number>;
    used_infoproviders: Array<number>;
    images: Array<Diagram>;
    backgroundImage: number;
    backgroundType: string;
    backgroundColor: string;
    backgroundColorEnabled: boolean;
    itemCounter: number;
    scene_items: string;
}
