import { createContext, useContext, useReducer } from 'react';
import { ModeIndexes } from '../components/Editor/Modes';
import defaultPresets from '../presetTemplates/default';
import sysExPreset from '../presetTemplates/default/sysEx.json';

const DataContext = createContext(null);
const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
    const [data, dispatch] = useReducer(
        dataReducer,
        {
            firmwareVersion: null,
            currentPreset: null,
            deviceIsConnected: false,
            midiInput: null,
            midiOutput: null,
            midiDeviceName: null,
            systemMessage: null,
            openMessageDialog: false,
            selectedKnobIndex: 0
        }
    );

    return (
        <DataContext.Provider value={data}>
            <DataDispatchContext.Provider
                value={dispatch}
            >
                {children}
            </DataDispatchContext.Provider>
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}

export function useDataDispatch() {
    return useContext(DataDispatchContext);
}

function dataReducer(data, action) {
    const {
        currentPreset,
    } = data;

    switch (action.type) {
        case "setMidiInput":
            return {
                ...data,
                midiInput: action.midiInput
            }
        case "setMidiOutput":
            return {
                ...data,
                midiOutput: action.midiOutput
            }
        case "setDeviceIsConnected":
            return {
                ...data,
                deviceIsConnected: action.deviceIsConnected
            }
        case "updatePreset":
            return {
                ...data,
                currentPreset: action.preset
            }
        case "updateMidiThru":
            return {
                ...data,
                currentPreset: {
                    ...currentPreset,
                    thruMode: action.thruMode
                }
            }
        case "updateCurrentDevicePresetIndex":
            return {
                ...data,
                currentPreset: {
                    ...currentPreset,
                    presetID: action.currentDevicePresetIndex
                }
            }
        case "setMidiDeviceName":
            return {
                ...data,
                midiDeviceName: action.midiDeviceName
            }
        case "setFirmwareVersion":
            if (action.firmwareVersion) {
                if (action.firmwareVersion[0] > 29) {
                    return {
                        ...data,
                        firmwareVersion: action.firmwareVersion,
                        currentPreset: sysExPreset
                    }

                } else if (action.firmwareVersion[0] < 4) {
                    return {
                        ...data,
                        firmwareVersion: action.firmwareVersion,
                        currentPreset: defaultPresets.defaultPreset_v3
                    }
                } else {
                    return {
                        ...data,
                        firmwareVersion: action.firmwareVersion,
                        currentPreset: defaultPresets.defaultPreset_v4
                    }
                }
            }
            return {
                ...data,
            }
        case "setSystemMessage":
            return {
                ...data,
                systemMessage: action.systemMessage,
                openMessageDialog: action.openMessageDialog
            }
        case "openMessageDialog":
            return {
                ...data,
                openMessageDialog: action.openMessageDialog
            }
        case "setSelectedKnobIndex":
            return {
                ...data,
                selectedKnobIndex: action.selectedKnobIndex
            }
        case "updateKnobData":
            return {
                ...data,
                currentPreset: {
                    ...currentPreset,
                    knobs: currentPreset.knobs.map(knob => {
                        if (knob.id === action.currentKnob.id) {
                            return {
                                ...action.currentKnob
                            }
                        }

                        return knob;
                    })
                }
            };

        case "modeChanged":
            return {
                ...data,
                currentPreset: {
                    ...currentPreset,
                    knobs: currentPreset.knobs.map(knob => {
                        if (knob.id === action.currentKnob.id) {
                            if (action.currentKnob.mode === ModeIndexes.KNOB_MODE_HIRES) {
                                if (knob.msb > 31) {
                                    return {
                                        ...action.currentKnob,
                                        msb: 0,
                                        lsb: 32
                                    }
                                } else {
                                    return {
                                        ...action.currentKnob,
                                        lsb: action.currentKnob.msb + 32
                                    }
                                }
                            } else {
                                return {
                                    ...action.currentKnob
                                }
                            }
                        }

                        return knob;
                    })
                }
            };

        default:
            throw Error('Unknown action: ' + action.type);
    }
}
