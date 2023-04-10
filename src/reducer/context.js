import { createContext, useContext, useReducer } from 'react';
import { ModeIndexes } from '../components/Editor/Modes';

const DataContext = createContext(null);
const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
    const [data, dispatch] = useReducer(
        dataReducer,
        {
            firmwareVersion: null,
            currentPreset: null
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
    console.log(data, action);
    switch (action.type) {
        case "setFirmwareVersion":
            return {
                ...data,
                firmwareVersion: action.firmwareVersion
            }
        case "setData":
            return {
                ...data,
                currentPreset: { ...action.data }
            };

        case "setKnob":
            return {
                ...data,
                currentPreset: {
                    ...data.currentPreset,
                    knobs: data.currentPreset.knobs.map(knob => {
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
                    ...data.currentPreset,
                    knobs: data.currentPreset.knobs.map(knob => {
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
