import {Job} from "./index";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import React from "react";

export const renderTextField = (job: Job, classes: any, edited: boolean, openHandler: () => void, timeDisplay: () => string | undefined, next: string) => {
    return (
        <div>
            <div>
                <TextField
                    className={classes.inputFields}
                    label="Thema"
                    defaultValue={job.topicName}
                    InputProps={{
                        disabled: true,
                    }}
                    variant="outlined"
                />
            </div>
            <div>
                <Button className={classes.inputButton} onClick={openHandler}>
                    <TextField
                        className={classes.inputFields}
                        label="Zeitplan"
                        defaultValue={timeDisplay()}
                        InputProps={{
                            disabled: edited,
                            readOnly: true
                        }}
                        variant="outlined"
                    />
                </Button>

            </div>
            <div>
                <TextField
                    className={classes.inputFields}
                    label="nächstes Video"
                    defaultValue={next}
                    InputProps={{
                        disabled: true,
                    }}
                    variant="outlined"
                />
            </div>
        </div>
    )
}