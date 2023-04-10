import { forEach, join, map } from 'lodash';
import { SAVE_PRESET, SET_KNOB_MODE, START_SYSEX_MESSAGE, SET_THRU_MODE } from './commands';
import { byteString } from '../../utils';

export function generateSysExFromPreset(currentPreset) {
    const messages = [];
    const {
        knobs
    } = currentPreset;

    forEach(knobs, (knob) => {
        const {
            hardwareId,
            mode,
            msb,
            lsb,
            channel,
            invert_a,
            invert_b
        } = knob;

        const knobMessage = [
            SET_KNOB_MODE,
            hardwareId,
            msb,
            lsb,
            channel,
            mode,
            +invert_a,
            +invert_b
        ];

        messages.push(knobMessage);
    });

    messages.push([SAVE_PRESET, currentPreset.presetID]);

    return messages;
}

export function generateSysExFromPresetV2(currentPreset) {
    const messages = [];
    const {
        knobs,
        thruMode,
    } = currentPreset;

    const knobMessage = map(knobs, knob => {
        const {
            hardwareId,
            sysExMessage,
            MSBFirst,
            valuesIndex,
            minValue,
            maxValue,
            isSigned
        } = knob;

        return [
            SET_KNOB_MODE,
            hardwareId,
            +MSBFirst,
            valuesIndex,
            minValue >> 4,
            minValue & 0x0F,
            maxValue >> 4,
            maxValue & 0x0F,
            +isSigned,
            START_SYSEX_MESSAGE,
            sysExMessage.length,
            ...map(sysExMessage, byte => parseInt(byte, 16))
        ];
    });

    const thruModeMessage = [
        SET_THRU_MODE,
        thruMode
    ];

    messages.push(...knobMessage);
    messages.push(thruModeMessage);
    messages.push([SAVE_PRESET, currentPreset.presetID]);

    return messages;
}

export function generateSysExFromPresetV3(currentPreset) {
    const messages = [];
    const {
        knobs,
        thruMode
    } = currentPreset;

    forEach(knobs, (knob) => {
        const {
            hardwareId,
            mode,
            msb,
            lsb,
            channel_a,
            channel_b,
            min_a,
            max_a,
            min_b,
            max_b,
            invert_a,
            invert_b
        } = knob;

        const channels = parseInt(byteString(channel_a - 1, 4) + byteString(channel_b - 1, 4), 2);
        const properties = parseInt(join(["0", byteString(mode, 3), +(channel_b < 0), +(channel_a < 0), +invert_b, +invert_a], ""), 2);

        const knobMessage = [
            SET_KNOB_MODE,
            hardwareId,
            msb,
            lsb,
            channels,
            properties,
            min_a,
            max_a,
            min_b,
            max_b
        ];

        messages.push(knobMessage);
    });

    const thruModeMessage = [
        SET_THRU_MODE,
        thruMode
    ];

    messages.push(thruModeMessage);
    messages.push([SAVE_PRESET, currentPreset.presetID]);

    return messages;
}

// Accepts target obejct of input onChange event
export function validateValueRange({ value, min, max }) {
    return Math.max(Number(min), Math.min(Number(max), Number(value)));
}