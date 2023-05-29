import {
    Checkbox,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function Version3Form({
    currentKnob,
    handleChange
}) {
    const {
        msb,
        invert_a,
    } = currentKnob;

    return (
        <Stack
            direction="column"
            spacing={2}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Control Number"
                    type="number"
                    name="msb"

                    InputProps={{ inputProps: { min: 0, max: 127 } }}
                    value={msb}
                    onChange={handleChange}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invert_a}
                            id="invert_a"
                            onChange={handleChange}
                        />
                    }
                    label="Invert" />
            </Stack>
        </Stack >
    )
}

export default Version3Form;