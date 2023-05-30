import React from "react";
import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ChannelSelect from "../../Components/ChannelSelect";

function Version4Form({
    currentKnob,
    handleChange
}) {
    const {
        msb,
        lsb,
        min_a,
        min_b,
        max_a,
        max_b,
        channel_a,
        channel_b,
        invert_a,
        invert_b
    } = currentKnob;

    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="space-evenly"
            divider={<Divider orientation="vertical" light />}
        >
            <Stack
                direction="column"
                spacing={2}
            >
                <Typography variant="h6" component="div" gutterBottom>
                    Macro A
                </Typography>
                <FormControl fullWidth>
                    <TextField
                        size="small"
                        label="Control Change A"
                        type="number"
                        name="msb"

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={msb}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel id="channel-select-label">Channel A</InputLabel>
                    <ChannelSelect
                        channel={channel_a}
                        handleChange={handleChange}
                        label="Channel A"
                        name="channel_a" />
                </FormControl>

                <Stack
                    direction="row"
                    spacing={1}
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
                </Stack>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invert_a}
                            id="invert_a"
                            onChange={handleChange}
                        />
                    }
                    label="Invert Value A" />
            </Stack>

            <Stack
                direction="column"
                spacing={2}
            >
                <Typography variant="h6" component="div" gutterBottom>
                    Macro B
                </Typography>
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


                <FormControl fullWidth size="small">
                    <InputLabel id="channel-select-label">Channel B</InputLabel>
                    <ChannelSelect
                        channel={channel_b}
                        handleChange={handleChange}
                        label="Channel B"
                        name="channel_b" />
                </FormControl>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Min"
                        type="number"
                        name="min_b"

                        InputProps={{ inputProps: { min: 0, max: max_b } }}
                        value={min_b}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Max"
                        type="number"
                        name="max_b"

                        InputProps={{ inputProps: { min: min_b, max: 127 } }}
                        value={max_b}
                        onChange={handleChange}
                    />
                </Stack>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invert_b}
                            id="invert_b"
                            onChange={handleChange}
                        />
                    }
                    label="Invert Value B" />
            </Stack>
        </Stack>
    )
}

export default Version4Form;