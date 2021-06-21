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

/**
 * This type is needed because the answer of the backend consists of a list of infProviders.
 */
export type fetchAllBackendAnswer = Array<InfoProviderData>
