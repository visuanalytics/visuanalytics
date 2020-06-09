import React from "react"
import { FormControl, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core"

export const WeekdayCheckboxes: React.FC = () => {
    return (
        <div>
            <FormControl component="fieldset"  >
                <FormGroup >
                    <FormControlLabel
                        control={<Checkbox />}
                        label="montags"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="dienstags"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="mittwochs"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="donnerstags"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="freitags"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="samstags"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="sonntags"
                    />
                </FormGroup>
            </FormControl>
        </div>
    )
}