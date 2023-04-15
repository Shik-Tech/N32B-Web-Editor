import { createSlice } from '@reduxjs/toolkit'
import { ModeIndexes } from '../../components/Editor/Modes';

export const presetSlice = createSlice({
    name: 'device',
    initialState: {
        currentPreset: null,
        selectedKnobIndex: 0
    },
    reducers: {
        setPreset: (state, action) => {
            state.currentPreset = action.payload;
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
            const {
                knobIndex,
                currentKnob
            } = action.payload;

            state.currentPreset.knobs[knobIndex ? knobIndex : state.selectedKnobIndex] = currentKnob;
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