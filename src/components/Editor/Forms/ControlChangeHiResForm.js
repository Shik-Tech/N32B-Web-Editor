import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import React from "react";

function ControlChangeHiResForm({
    currentKnob,
    handleHiResChange,
    handleInvertValueAChange
}) {
    const {
        msb,
        lsb,
        invert_a
    } = currentKnob;

    return (
        <Stack
            direction="row"
            spacing={2}
        >
            <TextField
                fullWidth
                size="small"
                label="MSB"
                type="number"

                InputProps={{ inputProps: { min: 0, max: 31 } }}
                value={msb}
                onChange={handleHiResChange}
            />
            <TextField
                fullWidth
                size="small"
                label="LSB"
                type="number"
                disabled={true}
                InputProps={{ inputProps: { min: 0, max: 31 } }}
                value={lsb}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={invert_a}
                        onChange={handleInvertValueAChange}
                    />
                }
                label="Invert" />
        </Stack>
    )
}

export default ControlChangeHiResForm;