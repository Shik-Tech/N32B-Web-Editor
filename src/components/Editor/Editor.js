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

    function handleChannelChange(event) {
        handleKnobDataChange(
            currentKnob, {
            channel: parseInt(event.target.value)
        });
    }

    function handleModeSelect(e) {
        dispatch(updateKnobMode({ mode: parseInt(e.target.value), currentKnob }));
    }

    function handleChannelAChange(event) {
        handleKnobDataChange(
            currentKnob, {
            channel_a: parseInt(event.target.value)
        });
    }

    function handleChannelBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            channel_b: parseInt(event.target.value)
        });
    }
    function handleMinAChange(event) {
        handleKnobDataChange(
            currentKnob, {
            min_a: parseInt(event.target.value)
        });
    }
    function handleMaxAChange(event) {
        handleKnobDataChange(
            currentKnob, {
            max_a: parseInt(event.target.value)
        });
    }
    function handleMinBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            min_b: parseInt(event.target.value)
        });
    }
    function handleMaxBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            max_b: parseInt(event.target.value)
        });
    }

    function handleMSBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            msb: validateValueRange(event.target)
        });
    }
    function handleLSBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            lsb: validateValueRange(event.target)
        });
    }

    function handleHiResChange(event) {
        handleKnobDataChange(
            currentKnob, {
            msb: validateValueRange(event.target),
            lsb: validateValueRange(event.target) + 32
        });
    }

    function handleInvertValueAChange(event) {
        handleKnobDataChange(
            currentKnob, {
            invert_a: event.target.checked
        });
    }

    function handleInvertValueBChange(event) {
        handleKnobDataChange(
            currentKnob, {
            invert_b: event.target.checked
        });
    }

    const formStandardProps = {
        handleMSBChange,
        handleInvertValueAChange
    }

    const formMacroProps = {
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
    };

    const formRPNProps = {
        handleMSBChange,
        handleLSBChange,
        handleInvertValueAChange
    }

    const formHiResProps = {
        handleHiResChange,
        handleInvertValueAChange
    }

    const displayForms = [
        <></>,
        <ControlChangeForm {...props} {...formStandardProps} />,
        <ControlChangeMacroForm {...props} {...formMacroProps} />,
        <ControlChangeRPNForm {...props} {...formRPNProps} />,
        <ControlChangeRPNForm {...props} {...formRPNProps} />,
        <ControlChangeHiResForm {...props} {...formHiResProps} />
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
                        handleChannelChange={handleChannelChange}
                        label="Channel" />
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
                        handleChannelChange={handleChannelAChange}
                        label="Channel" />
                </FormControl>
            }
            {displayForms[currentKnob.mode]}
        </Stack>
    );
}

export default Editor;