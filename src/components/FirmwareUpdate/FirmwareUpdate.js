// import React from 'react';
// import { Button, Grid, MenuItem, Select } from '@mui/material';
// import { useState } from 'react';
// import { map } from 'lodash';
// import firmwares from './firmwares';
// import Avrgirl from 'avrgirl-arduino';
// import SerialPort from 'browser-serialport';

// function FirmwareUpdate() {
//     const [selectedFile, setSelectedFile] = useState(firmwares[0].value);

//     const handleFirmwareSelect = (event) => {
//         setSelectedFile(event.target.value);
//     }

//     // Find the port for Arduino Pro Micro to trigger reset
//     async function findResetPort() {
//         let resetPort;
//         Avrgirl.list((err, ports) => {
//             console.log(err, ports);
//             resetPort = ports.find((port) => {
//                 return port.vendorId === '1d50' && port.productId === '614f';
//             });
//         });

//         if (!resetPort) {
//             throw new Error('Arduino Pro Micro reset port not found');
//         }
//         return resetPort.path;
//     }

//     // Find the port for Arduino to upload hex file
//     async function findUploadPort() {
//         await new Promise((resolve) => setTimeout(resolve, 2000));

//         let uploadPort;
//         Avrgirl.list((err, ports) => {
//             uploadPort = ports.find((port) => {
//                 return (port.vendorId === '1d50' && port.productId === '614f') ||
//                     (port.vendorId === '2341' && port.productId === '0036') ||
//                     port.vendorId === '2341';
//             });
//         });

//         if (uploadPort.length === 0) {
//             throw new Error('Arduino upload port not found');
//         }
//         return uploadPort.path;
//     }

//     const handleUpload = async () => {
//         const resetPort = await findResetPort();

//         // Trigger reset on Arduino Pro Micro
//         const arduinoResetPort = new SerialPort({ path: resetPort, baudRate: 1200 });
//         arduinoResetPort.on('open', () => {
//             arduinoResetPort.close(async () => {
//                 const uploadPort = await findUploadPort();
//                 const avrgirl = new Avrgirl({
//                     board: 'micro',
//                     port: uploadPort,
//                     manualReset: true
//                 });
//                 const filePath = `${__dirname}/hexs/${selectedFile}`
//                 avrgirl.flash(filePath, (error) => {
//                     if (error) {
//                         console.error(error);
//                     } else {
//                         console.log('Upload complete');
//                     }
//                 });
//             });
//         });
//     }
//     // const handleUpload = async () => {
//     //     try {
//     //         const formData = new FormData();
//     //         formData.set('hexFile', selectedFile);

//     //         await axios.post('/api/upload', formData, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             }
//     //         })
//     //             .then((response) => {
//     //                 console.log(response.data);
//     //             })
//     //             .catch((error) => {
//     //                 console.error(error);
//     //             });
//     //     } catch (error) {
//     //         console.error('Error uploading hex file:', error);
//     //     }
//     // };

//     return (
//         <Grid
//             container
//             spacing={2}
//             direction="column"
//             alignItems="center"
//             justifyContent="center"
//             style={{ minHeight: 'calc(100vh - 48px)', textAlign: 'center' }}
//         >
//             <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 value={selectedFile}
//                 label="Age"
//                 onChange={handleFirmwareSelect}
//             >
//                 {map(firmwares, firmware => (
//                     <MenuItem key={firmware.version} value={firmware.value}>{firmware.name} - {firmware.version}</MenuItem>
//                 ))}
//             </Select>
//             <Button onClick={handleUpload}>
//                 Upload
//             </Button>
//         </Grid>
//     );
// }

// export default FirmwareUpdate;
