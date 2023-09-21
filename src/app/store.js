import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './slices/deviceReducer';
import presetReducer from './slices/presetReducer';

export default configureStore({
    reducer: {
        device: deviceReducer,
        preset: presetReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['device/setConnectedDevices'],
                // Ignore these paths in the state
                ignoredPaths: ['device.midiInput', 'device.midiOutput'],
            },
        }),
});