import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { map } from 'lodash';

function OutputMode({ outputMode, handleOutputModeChange, outputOptions }) {
    return (
        <FormControl fullWidth size="small">
            <InputLabel id="output-mode-label">Preset Output Mode</InputLabel>
            <Select
                labelId="output-mode-label"
                id="output-mode-select"
                label="Preset Output Mode"

                value={outputMode}
                onChange={handleOutputModeChange}
            >
                {map(outputOptions, ({ value, name }) =>
                    <MenuItem value={value} key={value}>{name}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default OutputMode;