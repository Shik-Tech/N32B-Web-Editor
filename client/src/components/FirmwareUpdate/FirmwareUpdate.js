import React from 'react';
import axios from 'axios';
import { Button, Grid, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { map } from 'lodash';
import firmwares from './firmwares';

function FirmwareUpdate() {
    const [selectedFile, setSelectedFile] = useState(firmwares[0].value);

    const handleFirmwareSelect = (event) => {
        setSelectedFile(event.target.value);
    }

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.set('hexFile', selectedFile);

            await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Error uploading hex file:', error);
        }
    };

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 'calc(100vh - 48px)', textAlign: 'center' }}
        >
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFile}
                label="Age"
                onChange={handleFirmwareSelect}
            >
                {map(firmwares, firmware => (
                    <MenuItem key={firmware.version} value={firmware.value}>{firmware.name} - {firmware.version}</MenuItem>
                ))}
            </Select>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </Grid>
    );
}

export default FirmwareUpdate;
