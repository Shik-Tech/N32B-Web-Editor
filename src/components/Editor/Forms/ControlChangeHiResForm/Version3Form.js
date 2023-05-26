import {
    Checkbox,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function Version3Form({
    currentKnob,
    handleHiResChange,
    handleChange
}) {
    const {
        msb,
        lsb,
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
                    label="MSB"
                    type="number"
                    name="msb"

                    InputProps={{ inputProps: { min: 0, max: 31 } }}
                    value={msb}
                    onChange={handleHiResChange}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="LSB"
                    type="number"
                    name="lsb"

                    disabled={true}
                    InputProps={{ inputProps: { min: 0, max: 31 } }}
                    value={lsb}
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

export default Version3Form;