/**
 * Custom types for different elements
 */
export type CustomCircle = {
    x: number;
    y: number;
    radius: number;
    id: string;
    color: string;
    rotation: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
};

export type CustomRectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    color: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
};

export type CustomLine = {
    x: number;
    y: number;
    id: string;
    color: string;
    rotation: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
};

export type CustomStar = {
    x: number;
    y: number;
    id: string;
    color: string;
    rotation: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
};

export type CustomText = {
    x: number;
    y: number;
    id: string;
    textContent: string;
    width: number;
    height: number;
    rotation: number;
    fontFamily: string;
    fontSize: number;
    color: string;
    scaleX: number;
    scaleY: number;
};

export type CustomImage = {
    x: number
    y: number;
    id: string;
    rotation: number;
    image: HTMLImageElement;
    imageId: number;
    imagePath: string;
    diagram: boolean;
    index: number;
    width: number;
    height: number;
    color: string;
    scaleX: number;
    scaleY: number;
};
/**
 * Types for the export of the final scene
 */
export type JsonExport = {
    scene_name: string;
    used_images: number[];
    used_infoproviders: number[];
    images: BaseImg;
    backgroundImage: number; //ID of the background image
    backgroundType: string;
    backgroundColor: string;
    backgroundColorEnabled: boolean;
    itemCounter: number;
    scene_items: Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>;
}

export type BaseImg = {
    type: string;
    path: string;
    overlay: Array<DataImage | DataText>;
}

export type DataImage = {
    description: string,
    type: string,
    pos_x: number, //X-Coordinate
    pos_y: number, //Y-Coordinate
    size_x: number, //Breite optional
    size_y: number, //Höhe optional
    color: string,
    path: string //Diagrammname "image_name" : "" eventuell
}

export type DataText = {
    description: string, //optional
    type: string,
    anchor_point: string,
    pos_x: number, //item.x
    pos_y: number, //item.y
    color: string, //item.color
    font_size: number, //item.fontSize
    font: string // "fonts/{item.font}.ttf"
    pattern: string // "Datum: {_req|api_key}"
    width: number
}

/**
 * Type for the response from uploading an image
 */
export type ResponseData = {
    image_id: number,
    path: string
}
