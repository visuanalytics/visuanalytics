export type HistorizedDataInfo = {
  name: string;
  interval: string;
};

/**
 * Represents the necessary information about a diagram in the sceneEditor.
 */
export type DiagramInfo = {
  name: string;
  type: string;
  url: string;
};

/**
 * Type for the information of a single image returned
 * by the backend when fetching all images.
 */
export type ImageBackendData = {
  image_id: number;
  path: string;
};

/**
 * Data type for the information stored of an image in the frontend.
 */
export type ImageFrontendData = {
  image_id: number;
  image_backend_path: string; //backend path/url
  image_blob_url: string; //blob url
};

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
export type InfoProviderData = {
  infoprovider_id: number;
  infoprovider_name: string;
};

/**
 * Type of the backend answer when posting a new image.
 */
export type ImagePostBackendAnswer = {
  image_id: number;
};
