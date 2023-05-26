import { map } from "lodash";
import React from "react";
import { useDispatch } from 'react-redux'
import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import ChannelSelect from "./Components/ChannelSelect";
import {
    ControlChangeMacroForm,
    ControlChangeForm,
    ControlChangeHiResForm,
    ControlChangeRPNForm
} from "./Forms";
import { ModeIndexes, Modes } from "./Modes";
import { validateValueRange } from "../UpdateDevice/utils";
import { updateKnobMode } from "../../app/slices/presetReducer";

function Editor(props) {
    const {
        currentKnob,
        firmwareVersion,
        handleKnobDataChange
    } = props;

    const dispatch = useDispatch();

    function handleModeSelect(e) {
        dispatch(updateKnobMode({ mode: parseInt(e.target.value), currentKnob }));
    }

    function handleChange(e) {
        if (e.target.type === "checkbox") {
            handleKnobDataChange(
                currentKnob, {
                [e.target.id]: e.target.checked
            });
        } else if (e.target.type === "number") {
            handleKnobDataChange(
                currentKnob, {
                [e.target.name]: validateValueRange(e.target)
            });
        } else {
            handleKnobDataChange(
                currentKnob, {
                [e.target.name]: parseInt(e.target.value)
            });
        }
    }

    function handleHiResChange(e) {
        handleKnobDataChange(
            currentKnob, {
            msb: validateValueRange(e.target),
            lsb: validateValueRange(e.target) + 32
        });
    }

    const displayForms = [
        <></>,
        <ControlChangeForm {...props} handleChange={handleChange} />,
        <ControlChangeMacroForm {...props} handleChange={handleChange} />,
        <ControlChangeRPNForm {...props} handleChange={handleChange} />,
        <ControlChangeRPNForm {...props} handleChange={handleChange} />,
        <ControlChangeHiResForm {...props} handleChange={handleChange} handleHiResChange={handleHiResChange} />
    ];
    return (
        <Stack
            spacing={2}
        >
            <FormControl fullWidth size="small">
                <InputLabel id="mode-select-label">Knob Mode</InputLabel>
                <Select
                    labelId="mode-select-label"
                    id="mode-select"
                    label="Knob Mode"
                    value={currentKnob.mode}
                    onChange={handleModeSelect}
                >
                    {map(Modes, mode =>
                        <MenuItem value={mode.value} key={mode.value}>{mode.name}</MenuItem>
                    )}
                </Select>
            </FormControl>
            {
                firmwareVersion[0] < 4 &&
                currentKnob.mode !== ModeIndexes.KNOB_MODE_DISABLE &&
                <FormControl fullWidth size="small">
                    <InputLabel id="channel-select-label">Channel</InputLabel>
                    <ChannelSelect
                        channel={currentKnob.channel}
                        handleChange={handleChange}
                        label="Channel"
                        name="channel" />
                </FormControl>
            }
            {
                firmwareVersion[0] > 3 &&
                currentKnob.mode !== ModeIndexes.KNOB_MODE_DISABLE &&
                currentKnob.mode !== ModeIndexes.KNOB_MODE_MACRO &&
                <FormControl fullWidth size="small">
                    <InputLabel id="channel-select-label">Channel</InputLabel>
                    <ChannelSelect
                        channel={currentKnob.channel_a}
                        handleChange={handleChange}
                        label="Channel"
                        name="channel_a" />
                </FormControl>
            }
            {displayForms[currentKnob.mode]}
        </Stack>
    );
}

export default Editor;