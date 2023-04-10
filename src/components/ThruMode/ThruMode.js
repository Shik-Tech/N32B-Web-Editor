import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { map } from 'lodash';

function ThruMode({ thruMode, handleThruModeChange, thruOptions }) {
    return (
        <FormControl fullWidth size="small">
            <InputLabel id="thru-mode-label">Preset Thru Mode</InputLabel>
            <Select
                labelId="thru-mode-label"
                id="thru-mode-select"
                label="Preset Thru Mode"

                value={thruMode}
                onChange={handleThruModeChange}
            >
                {map(thruOptions, ({value, name}) =>
                    <MenuItem value={value} key={value}>{name}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default ThruMode;