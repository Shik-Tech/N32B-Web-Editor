import {
    Checkbox,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function Version4Form({
    currentKnob,
    handleChange
}) {
    const {
        msb,
        invert_a,
        min_a,
        max_a
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
            </Stack>

            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Min"
                    type="number"
                    name="min_a"
                    InputProps={{ inputProps: { min: 0, max: max_a } }}
                    value={min_a}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Max"
                    type="number"
                    name="max_a"
                    InputProps={{ inputProps: { min: min_a, max: 127 } }}
                    value={max_a}
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
        </Stack>
    )
}

export default Version4Form;