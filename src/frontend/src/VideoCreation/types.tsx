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
