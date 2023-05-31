import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    firmwareVersion: null,
    deviceIsConnected: false,
    midiInput: null,
    midiOutput: null,
    midiDeviceName: null,
    systemMessage: null,
    openMessageDialog: false,
    isSyncing: false
};

export const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setConnectedDevices: (state, action) => {
            state.midiInput = action.payload.inputDevice;
            state.midiOutput = action.payload.outputDevice;
            state.midiDeviceName = action.payload.outputDevice.name;
        },
        setDeviceConnected: (state) => {
            state.deviceIsConnected = true;
        },
        setDeviceDisconnected: (state) => initialState,
        setMidiDeviceName: (state, action) => {
            state.midiDeviceName = action.payload;
        },
        setFirmwareVersion: (state, action) => {
            state.firmwareVersion = action.payload;
        },
        setSystemMessage: (state, action) => {
            state.systemMessage = action.payload;
        },
        setOpenMessageDialog: (state, action) => {
            state.openMessageDialog = action.payload;
        },
        setIsSyncing: (state, action) => {
            state.isSyncing = action.payload
        },
        // setUpdateFirmwareScreen: (state, action) => {
        //     state.isUpdateFirmwareScreen = action.payload
        // }
    }
});

export const {
    setConnectedDevices,
    setDeviceConnected,
    setDeviceDisconnected,
    setMidiDeviceName,
    setFirmwareVersion,
    setSystemMessage,
    setOpenMessageDialog,
    setIsSyncing,
} = deviceSlice.actions;

export default deviceSlice.reducer