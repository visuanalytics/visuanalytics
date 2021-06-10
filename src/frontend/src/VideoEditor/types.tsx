export enum Direction {
    Left = "LEFT",
    Right = "RIGHT"
}

export type SceneCardData = {
    entryId: string;
    sceneName: string;
    displayDuration: number;
    spokenText: string;
    visible: boolean;
}
