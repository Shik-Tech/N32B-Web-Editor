import React, { useState } from 'react';
import { map } from 'lodash';
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
    IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import UpdateProgress from '../UpdateProgress/UpdateProgress';

function SyncDEvice(props) {
    const {
        currentDevicePresetIndex,
        handlePresetChange,
        handleLoadFromDevice,
        firmwareVersion,
        isSyncing
    } = props;

    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                endIcon={<SyncRoundedIcon />}
                onClick={handleOpen}
            >
                Sync
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
                        <Typography variant='title'>Sync from Device</Typography>
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
                        Select which preset from your device will be synced to the editor:
                    </Typography>
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
                                color='warning'
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
                            endIcon={<SyncRoundedIcon />}
                            onClick={handleLoadFromDevice}
                        >
                            Sync
                        </Button>
                    </Stack>
                </Stack>
                <UpdateProgress
                    updating={isSyncing}
                    title="Syncing"
                />
            </Dialog>
        </>
    );
}

export default SyncDEvice;