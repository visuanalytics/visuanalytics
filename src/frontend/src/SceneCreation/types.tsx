export type HistorizedDataInfo = {
    name: string;
    interval: string;
}

export type DiagramInfo = {
    name: string;
    type: string;
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

