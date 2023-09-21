import { MenuItem, Select } from "@mui/material";
import { map } from "lodash";
import React from "react";

function ChannelSelect({ channel, handleChange, label, name }) {
    const options = [];
    for (let i = 0; i < 16; i++) {
        options[i] = i + 1;
    }
    return (
        <Select
            labelId="channel-select-label"
            id="channel-select"
            label={label}
            name={name}

            value={channel}
            onChange={handleChange}
        >
            <MenuItem value={0} key={0}>Use Global Channel</MenuItem>
            {map(options, value =>
                <MenuItem value={value} key={value}>Channel {value}</MenuItem>
            )}
        </Select>
    )
}

export default ChannelSelect;