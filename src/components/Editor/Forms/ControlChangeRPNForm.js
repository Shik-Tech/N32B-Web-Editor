import React from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";

function ControlChangeRPNForm({
    currentKnob,
    handleMSBChange,
    handleLSBChange,
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

                InputProps={{ inputProps: { min: 0, max: 127 } }}
                value={msb}
                onChange={handleMSBChange}
            />

            <TextField
                fullWidth
                size="small"
                label="LSB"
                type="number"

                InputProps={{ inputProps: { min: 0, max: 127 } }}
                value={lsb}
                onChange={handleLSBChange}
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

export default ControlChangeRPNForm;