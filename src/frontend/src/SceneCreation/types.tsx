export type HistorizedDataInfo = {
    name: string;
    interval: string;
}

/**
 * Represents the necessary information about a diagram in the sceneEditor.
 */
export type DiagramInfo = {
    name: string;
    type: string;
    url: string;
}

/**
 * Type for the information of a single image returned
 * by the backend when fetching all images.
 */
export type ImageBackendData = {
    image_id: number,
    image_name: string
}

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
export type InfoProviderData = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * Type of the backend answer when posting a new image.
 */
export type imagePostBackendAnswer = {
    image_id: number;
}
