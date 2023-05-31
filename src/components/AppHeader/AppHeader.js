import React from 'react';

import {
    AppBar,
    Box,
    Button,
    Divider,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';

import '../../App.css';
import logo from '../images/shik-logo-small.png';
import {
    UpdateDevice,
    SyncDevice,
} from '..';

function AppHeader({
    firmwareVersion,
    deviceIsConnected,
    midiOutput,
    midiDeviceName,
    isSyncing,
    currentPreset,
    fileInput,

    handleFirmwareUpdate,
    handleFileInputClick,
    handleLoadPreset,
    handleSavePreset,
    handlePresetUpdate,
    handleLoadFromDevice
}) {
    return (
        <AppBar position="static" >
            <Toolbar variant="dense">
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        divider={<Divider orientation="vertical" light />}
                        sx={{ flexGrow: 1 }}
                    >
                        <Box
                            component="img"
                            alt="SHIK logo"
                            src={logo}
                            sx={{
                                height: 20,
                                pt: 1
                            }}
                        />
                        <Typography sx={{ pt: 1 }} variant="body2" component="div">
                            N32B Editor
                        </Typography>
                        {deviceIsConnected && firmwareVersion &&
                            <Typography sx={{ pt: 1 }} variant="body2" component="div">
                                {midiDeviceName} < Typography variant="caption" sx={{ color: "#808080" }} >(v{firmwareVersion.join('.')})</Typography>
                                {firmwareVersion[0] > 29 &&
                                    " - SysEx"
                                }
                            </Typography>
                        }
                        {deviceIsConnected &&
                            <Button
                                onClick={handleFirmwareUpdate}
                                color="error"
                            >
                                Firmware Update
                            </Button>
                        }
                    </Stack>

                    {deviceIsConnected && firmwareVersion && currentPreset &&
                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                endIcon={<UploadFileRoundedIcon />}
                                onClick={handleFileInputClick}
                            >
                                Load
                                <input
                                    hidden
                                    type="file"
                                    ref={fileInput}
                                    onChange={handleLoadPreset}
                                />
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="success"
                                endIcon={<SimCardDownloadRoundedIcon />}
                                onClick={handleSavePreset}
                            >
                                Save
                            </Button>

                            <UpdateDevice
                                firmwareVersion={firmwareVersion}
                                currentPreset={currentPreset}
                                midiOutput={midiOutput}
                                currentDevicePresetIndex={currentPreset.presetID}
                                handlePresetUpdate={handlePresetUpdate}
                            />

                            <SyncDevice
                                isSyncing={isSyncing}
                                firmwareVersion={firmwareVersion}
                                currentPreset={currentPreset}
                                currentDevicePresetIndex={currentPreset.presetID}
                                handlePresetUpdate={handlePresetUpdate}
                                handleLoadFromDevice={handleLoadFromDevice}
                            />
                        </Stack>
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;