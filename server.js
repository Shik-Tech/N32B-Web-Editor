const express = require('express');
const formidable = require('formidable');
const AvrgirlArduino = require('avrgirl-arduino');
const { SerialPort } = require('serialport');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));

// Find the port for Arduino Pro Micro to trigger reset
async function findResetPort() {
    const ports = await SerialPort.list();
    const resetPort = ports.find((port) => {
        return port.vendorId === '1d50' && port.productId === '614f';
    });

    if (!resetPort) {
        throw new Error('Arduino Pro Micro reset port not found');
    }
    return resetPort.path;
}

// Find the port for Arduino to upload hex file
async function findUploadPort() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const ports = await SerialPort.list();
    const uploadPort = ports.find((port) => {
        return (port.vendorId === '1d50' && port.productId === '614f') ||
            (port.vendorId === '2341' && port.productId === '0036') ||
            port.vendorId === '2341';
    });

    if (uploadPort.length === 0) {
        throw new Error('Arduino upload port not found');
    }
    return uploadPort.path;
}

// Serve the static files of the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Route for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.post('/api/upload', (req, res) => {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing the form:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log(fields);

        if (!fields.hexFile) {
            res.status(400).send('No file uploaded');
            return;
        }
        try {
            const resetPort = await findResetPort();

            // Trigger reset on Arduino Pro Micro
            const arduinoResetPort = new SerialPort({ path: resetPort, baudRate: 1200 });
            arduinoResetPort.on('open', () => {
                arduinoResetPort.close(async () => {
                    const uploadPort = await findUploadPort();
                    const avrgirl = new AvrgirlArduino({
                        board: 'micro',
                        port: uploadPort,
                        manualReset: true
                    });
                    const filePath = `${__dirname}/hexs/${fields.hexFile}`
                    avrgirl.flash(filePath, (error) => {
                        if (error) {
                            console.error(error);
                            res.status(500).send('Internal Server Error');
                        } else {
                            console.log('Upload complete');
                            res.send('Upload successful');
                        }
                    });
                });
            });

        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});