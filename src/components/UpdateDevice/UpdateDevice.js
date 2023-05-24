import React, { useState } from 'react';
import { forEach, map } from 'lodash';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    Alert
} from '@mui/material';
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
    generateSysExFromPreset,
    generateSysExFromPresetV2,
    generateSysExFromPresetV3
} from './utils';
import { UpdateProgress } from '..';

function UpdateDevice(props) {
    const {
        currentPreset,
        midiOutput,
        currentDevicePresetIndex,
        handlePresetChange,
        firmwareVersion
    } = props;

    const [open, setOpen] = React.useState(false);
    const [updating, setUpdating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSaveToDevice = e => {
        setUpdating(true);
        let promise = Promise.resolve();
        let messages;
        if (firmwareVersion[0] > 29) {
            messages = generateSysExFromPresetV2(currentPreset);
        } else if (firmwareVersion[0] < 4) {
            messages = generateSysExFromPreset(currentPreset);
        } else {
            messages = generateSysExFromPresetV3(currentPreset);
        }
        forEach(messages, (message, key) => {
            promise = promise.then(() => {
                setProgress((key + 1) * 100 / messages.length);
                midiOutput.sendSysex(32, message);

                return new Promise(resolve => {
                    setTimeout(resolve, 50);
                });
            });
        });
        promise.then(() => {
            setUpdating(false);
            setOpen(false);
            setProgress(0);
        });
    }

    let presets;
    switch (true) {
        case firmwareVersion[0] === 4:
            presets = [0, 1, 2];
            break;
        case firmwareVersion[0] < 4:
            presets = [0, 1, 2, 3, 4];
            break;
        case firmwareVersion[0] > 29:
            presets = [0];
            break;
        default:
            presets = [0];
            break;
    }

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                color="warning"
                endIcon={<DownloadingRoundedIcon />}
                onClick={handleOpen}
            >
                Update
            </Button>
            <Dialog
                open={open}
            >
                <DialogTitle>
                    <Grid
                        container
                        justifyContent={"space-between"}
                        alignItems="center"
                    >
                        <Typography variant='title'>Update the Device</Typography>
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <Stack
                    spacing={2}
                    sx={{ m: 2 }}
                >
                    <Typography>
                        Choose which preset slot you wish to save your setup into, then click "UPDATE".
                    </Typography>
                    <Alert
                        severity='warning'
                        variant="filled"
                    >
                        Please finish setting up all the knobs before updating the device. <br />
                        It is recommended to do a bulk updates to preserve the device memory for long term usage.
                    </Alert>
                    <Alert
                        severity='error'
                        variant="filled"
                    >
                        You are about to overwrite Preset {currentDevicePresetIndex + 1}. <br />
                        This operation cannot be reversed!
                    </Alert>

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="preset-select-label">N32B Preset</InputLabel>
                            <Select
                                labelId="preset-select-label"
                                id="preset-select"
                                label="Device Preset"
                                value={currentDevicePresetIndex}
                                onChange={handlePresetChange}
                            >
                                {map(presets, (presetValue, key) =>
                                    <MenuItem value={presetValue} key={key}>Preset {presetValue + 1}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            endIcon={<DownloadingRoundedIcon />}
                            onClick={handleSaveToDevice}
                        >
                            Update
                        </Button>
                    </Stack>
                </Stack>
                <UpdateProgress
                    updating={updating}
                    progress={progress}
                    title="Updating"
                    variant="determinate"
                />
            </Dialog>
        </>
    );
}

export default UpdateDevice;