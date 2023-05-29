import React from "react";
import {
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
} from "@mui/material";

function Version3Form({
    currentKnob,
    handleChange
}) {
    const {
        msb,
        lsb,
        invert_a,
        invert_b
    } = currentKnob;

    return (
        <Stack
            spacing={2}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Control Change A"
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

            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Control Change B"
                    type="number"
                    name="lsb"

                    InputProps={{ inputProps: { min: 0, max: 127 } }}
                    value={lsb}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invert_b}
                            id="invert_b"
                            onChange={handleChange}
                        />
                    }
                    label="Invert" />
            </Stack>
        </Stack>
    )
}

export default Version3Form;