import {Job} from "./index";
import {Button} from "@material-ui/core";
import React from "react";
import { InputField } from "./style";

export const renderTextField = (job: Job, classes: any, edited: boolean, openHandler: () => void, timeDisplay: () => string | undefined, next: string) => {
    return (
        <div>
            <div>
                <InputField
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
                    <InputField
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
                <InputField
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