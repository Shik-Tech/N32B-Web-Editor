import { createSlice } from '@reduxjs/toolkit'
import { ModeIndexes } from '../../components/Editor/Modes';
import defaultPresets from '../../presetTemplates/default';
import sysExPreset from '../../presetTemplates/default/sysEx.json'

export const presetSlice = createSlice({
    name: 'device',
    initialState: {
        currentPreset: null,
        selectedKnobIndex: 0
    },
    reducers: {
        setPreset: (state, action) => {
            if (action.payload[0] > 29) {
                state.currentPreset = sysExPreset;
            } else if (action.payload[0] < 4) {
                state.currentPreset = defaultPresets.defaultPreset_v3;
            } else {
                state.currentPreset = defaultPresets.defaultPreset_v4;
            }
        },
        updatePreset: (state, action) => {
            state.currentPreset = action.payload;
        },
        updateMidiThru: (state, action) => {
            state.currentPreset.thruMode = action.payload;
        },
        setSelectedKnobIndex: (state, action) => {
            state.selectedKnobIndex = action.payload;;
        },
        updateCurrentDevicePresetIndex: (state, action) => {
            state.currentPreset.presetID = action.payload;
        },
        updateKnobData: (state, action) => {
            state.currentPreset.knobs[state.selectedKnobIndex] = action.payload;
        },
        updateKnobMode: (state, action) => {
            const knobState = state.currentPreset.knobs[state.selectedKnobIndex];
            if (action.payload.mode === ModeIndexes.KNOB_MODE_HIRES) {
                if (knobState.msb > 31) {
                    knobState.msb = 0;
                    knobState.lsb = 32;
                } else {
                    knobState.lsb = action.payload.currentKnob.msb + 32;
                }
            }
            knobState.mode = action.payload.mode;
        },
    }
})

export const {
    setPreset,
    updatePreset,
    updateMidiThru,
    setSelectedKnobIndex,
    updateCurrentDevicePresetIndex,
    updateKnobData,
    updateKnobMode
} = presetSlice.actions;

export default presetSlice.reducer