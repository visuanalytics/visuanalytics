/* InfoProviderOverview

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
export type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}


/**
 * This type is needed because the answer of the backend consists of a list of jsonRef's.
 */
export type fetchAllBackendAnswer = Array<jsonRef>


//bisher nur zum testen verwendet.
export type answer = {
    err_msg: string;
}

export type LogEntry = {
    jobID: string;
    jobName: string;
    state: string;
    errorMsg: string;
    errorTraceback: string;
    duration: string;
    startTime: string;
}