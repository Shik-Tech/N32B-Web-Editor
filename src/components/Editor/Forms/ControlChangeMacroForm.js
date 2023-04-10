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
import ChannelSelect from "../Components/ChannelSelect";

function ControlChangeMacroForm({
    currentKnob,
    firmwareVersion,
    handleMSBChange,
    handleLSBChange,
    handleInvertValueAChange,
    handleInvertValueBChange,
    handleChannelAChange,
    handleChannelBChange,
    handleMinAChange,
    handleMaxAChange,
    handleMinBChange,
    handleMaxBChange
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

    function UIVersion3() {
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

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={msb}
                        onChange={handleMSBChange}
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

                <Stack
                    direction="row"
                    spacing={2}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Control Change B"
                        type="number"

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={lsb}
                        onChange={handleLSBChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={invert_b}
                                onChange={handleInvertValueBChange}
                            />
                        }
                        label="Invert" />
                </Stack>
            </Stack>
        )
    }

    function UIVersion4() {
        return (
            <Stack
                direction="row"
                spacing={2}
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
                    <TextField
                        fullWidth
                        size="small"
                        label="Control Change A"
                        type="number"

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={msb}
                        onChange={handleMSBChange}
                    />


                    <FormControl fullWidth size="small">
                        <InputLabel id="channel-select-label">Channel A</InputLabel>
                        <ChannelSelect
                            channel={channel_a}
                            handleChannelChange={handleChannelAChange}
                            label="Channel A" />
                    </FormControl>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <FormControl fullWidth>
                            <TextField
                                size="small"
                                label="Min"
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: max_a } }}
                                value={min_a}
                                onChange={handleMinAChange}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                size="small"
                                label="Max"
                                type="number"
                                InputProps={{ inputProps: { min: min_a, max: 127 } }}
                                value={max_a}
                                onChange={handleMaxAChange}
                            />
                        </FormControl>
                    </Stack>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={invert_a}
                                onChange={handleInvertValueAChange}
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

                        InputProps={{ inputProps: { min: 0, max: 127 } }}
                        value={lsb}
                        onChange={handleLSBChange}
                    />


                    <FormControl fullWidth size="small">
                        <InputLabel id="channel-select-label">Channel B</InputLabel>
                        <ChannelSelect
                            channel={channel_b}
                            handleChannelChange={handleChannelBChange}
                            label="Channel B" />
                    </FormControl>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <FormControl fullWidth>
                            <TextField
                                size="small"
                                label="Min"
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: max_b } }}
                                value={min_b}
                                onChange={handleMinBChange}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                size="small"
                                label="Max"
                                type="number"
                                InputProps={{ inputProps: { min: min_b, max: 127 } }}
                                value={max_b}
                                onChange={handleMaxBChange}
                            />
                        </FormControl>
                    </Stack>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={invert_b}
                                onChange={handleInvertValueBChange}
                            />
                        }
                        label="Invert Value B" />
                </Stack>
            </Stack>
        )
    }

    return (
        <>
            {firmwareVersion[0] < 4 &&
                <UIVersion3 />
            }
            {firmwareVersion[0] > 3 &&
                <UIVersion4 />
            }
        </>
    )
}

export default ControlChangeMacroForm;