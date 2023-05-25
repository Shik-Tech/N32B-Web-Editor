import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { WebMidi } from "webmidi";
import {
  N32B,
  Editor,
  SysExEditor,
  UpdateDevice,
  ConnectDevice,
  Version,
  SyncDevice,
  SystemMessages,
  ThruMode,
  OutputMode
} from './components';
import logo from './components/images/shik-logo-small.png';
import './App.css';
import { Container } from '@mui/system';
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
import { ThruOptions } from './components/ThruMode/ThruOptions';
import { OutputOptions } from './components/OutputMode/OutputOptions';
import {
  setDeviceIsConnected,
  setFirmwareVersion,
  setIsSyncing,
  setMidiDeviceName,
  setMidiInput,
  setMidiOutput,
  setSystemMessage
} from './app/slices/deviceReducer';
import {
  setPreset,
  setSelectedKnobIndex,
  updateCurrentDevicePresetIndex,
  updateKnobData,
  updateMidiOutput,
  updateMidiThru,
  updatePreset
} from './app/slices/presetReducer';

import defaultPresets from './presetTemplates/default';
import sysExPreset from './presetTemplates/default/sysEx.json'
import {
  END_OF_TRANSMISSION,
  SEND_FIRMWARE_VERSION,
  SET_OUTPUT_MODE,
  SET_THRU_MODE,
  SYNC_KNOBS
} from './components/UpdateDevice/commands';
import { findIndex } from 'lodash';
import { byteString } from './utils';

function App() {
  const {
    firmwareVersion,
    deviceIsConnected,
    midiInput,
    midiOutput,
    midiDeviceName,
    systemMessage,
    openMessageDialog,
    isSyncing
  } = useSelector(state => state.device);

  const {
    currentPreset,
    selectedKnobIndex
  } = useSelector(state => state.preset);
  const dispatch = useDispatch();

  const appVersion = 'v2.3.0';
  let firmwareVersionListener = useRef();
  let sysExListener = useRef();

  WebMidi.enable({ sysex: true }).then(() => {
    WebMidi.waitFor("connected").then(() => {
      const foundedInputDevice = WebMidi.getInputByName("N32B");
      const foundedOutputDevice = WebMidi.getOutputByName("N32B");

      if (foundedInputDevice && !midiInput) {
        dispatch(setMidiInput(foundedInputDevice));
      }
      if (foundedOutputDevice && !midiOutput) {
        dispatch(setMidiOutput(foundedOutputDevice));
      }
    });

    WebMidi.waitFor("disconnected").then(() => {
      if (deviceIsConnected) {
        dispatch(setDeviceIsConnected(false));
        dispatch(updateCurrentDevicePresetIndex(0));
      }
    });

  }).catch(err => {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    }
  });

  useEffect(() => {
    if (!currentPreset && firmwareVersion) {
      let preset;
      if (firmwareVersion > 29) {
        preset = sysExPreset;
      } else if (firmwareVersion < 4) {
        preset = defaultPresets.defaultPreset_v3;
      } else {
        preset = defaultPresets.defaultPreset_v4;
      }
      dispatch(setPreset(preset));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmwareVersion, currentPreset]);

  useEffect(() => {
    if (midiOutput) {
      midiOutput.sendSysex(32, [SEND_FIRMWARE_VERSION]);
      dispatch(setMidiDeviceName(midiOutput.name));
      dispatch(setDeviceIsConnected(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiOutput]);

  useEffect(() => {
    if (midiInput) {
      if (!firmwareVersionListener.current) {
        firmwareVersionListener.current = midiInput.addOneTimeListener('sysex', handleSysEx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiInput]);

  function handleSysEx(e) {
    const {
      dataBytes,
      message: {
        manufacturerId
      }
    } = e;
    let currentKnob = {};
    if (manufacturerId[0] === 32) {
      switch (dataBytes[0]) {
        case SEND_FIRMWARE_VERSION:
          if (dataBytes.length > 2) {
            const firmwareVersion = dataBytes.slice(1);
            dispatch(setFirmwareVersion(firmwareVersion));
          }
          break;
        case SYNC_KNOBS:
          if (dataBytes.length > 7) {
            const knobIndex = findIndex(currentPreset.knobs, knob => knob.hardwareId === dataBytes[1]);
            if (knobIndex > -1) {
              switch (true) {
                case firmwareVersion[0] > 29:
                  currentKnob = {
                    ...currentPreset.knobs[knobIndex],
                    MSBFirst: Boolean(dataBytes[2]),
                    valuesIndex: dataBytes[3],
                    minValue: (dataBytes[4] << 4) | dataBytes[5],
                    maxValue: (dataBytes[6] << 4) | dataBytes[7],
                    isSigned: Boolean(dataBytes[8]),
                    sysExMessage: []
                  }
                  const messageSize = dataBytes[9];

                  for (let byteIndex = 0; byteIndex < messageSize; byteIndex++) {
                    currentKnob.sysExMessage.push(dataBytes[byteIndex + 10].toString(16).padStart(2, '0'));
                  }
                  break;

                case firmwareVersion[0] < 4:
                  currentKnob = {
                    ...currentPreset.knobs[knobIndex],
                    mode: dataBytes[5],
                    msb: dataBytes[2],
                    lsb: dataBytes[3],
                    channel: dataBytes[4],
                    invert_a: Boolean(dataBytes[6]),
                    invert_b: Boolean(dataBytes[7])
                  };
                  break;

                case firmwareVersion[0] > 3:
                  const properties = byteString(dataBytes[6]);
                  const channel_a = parseInt(byteString(dataBytes[4], 4), 2);
                  const channel_b = parseInt(byteString(dataBytes[5], 4), 2);
                  const useOwnChannelA = Boolean(parseInt(properties.slice(5, 6), 2));
                  const useOwnChannelB = Boolean(parseInt(properties.slice(4, 5), 2));
                  currentKnob = {
                    ...currentPreset.knobs[knobIndex],
                    mode: parseInt(properties.slice(1, 4), 2),
                    msb: dataBytes[2],
                    lsb: dataBytes[3],
                    channel_a: useOwnChannelA ? channel_a + 1 : 0,
                    channel_b: useOwnChannelB ? channel_b + 1 : 0,
                    invert_a: Boolean(parseInt(properties.slice(7, 8), 2)),
                    invert_b: Boolean(parseInt(properties.slice(6, 7), 2)),
                    min_a: dataBytes[7],
                    max_a: dataBytes[8],
                    min_b: dataBytes[9],
                    max_b: dataBytes[10],
                  };
                  break;

                default:
                  break;
              }

              dispatch(updateKnobData({ currentKnob, knobIndex }));
            }
          }
          break;

        case SET_THRU_MODE:
          const thruMode = dataBytes[1];
          dispatch(updateMidiThru(thruMode));
          break;

        case SET_OUTPUT_MODE:
          const outputMode = dataBytes[1];
          dispatch(updateMidiOutput(outputMode));
          break;

        case END_OF_TRANSMISSION:
          dispatch(setIsSyncing(false));
          break;

        default:
          break;
      }
    }
  }

  const fileInput = useRef(null);
  const handleFileInputClick = event => {
    event.target.value = null;
    fileInput.current.click();
  }

  const handleLoadPreset = e => {
    const reader = new FileReader();
    if (fileInput.current.files.length > 0) {
      const file = fileInput.current.files[0];
      reader.onload = (event => {
        const preset = JSON.parse(event.target.result);
        if (
          (firmwareVersion[0] > 29 && preset.presetVersion < 3) ||
          ((firmwareVersion[0] === 2 || firmwareVersion[0] === 3) && preset.presetVersion > 2) ||
          (firmwareVersion[0] === 4 && preset.presetVersion !== 4)
        ) {
          dispatch(setSystemMessage("The preset version is not matching the device firmware."));
          dispatch(openMessageDialog(true));
          return;
        } else {
          dispatch(updatePreset(preset));
        }
      });
      reader.readAsText(file);
    }
  }

  const handleSavePreset = async () => {
    const fileName = `N32B-Preset-${currentPreset.presetName}`;
    const json = JSON.stringify(currentPreset);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleSelectedKnobIndex(selectedKnobIndex) {
    dispatch(setSelectedKnobIndex(selectedKnobIndex));
  }

  const handleCloseSystemDialog = () => {
    dispatch(openMessageDialog(false));
    dispatch(setSystemMessage(null));
  }

  const handlePresetChange = e => {
    const presetIndex = parseInt(e.target.value);
    dispatch(updateCurrentDevicePresetIndex(presetIndex));
    midiOutput.sendProgramChange(presetIndex, 1);
  }

  function handleKnobDataChange(currentKnob, data = {}) {
    dispatch(updateKnobData(
      {
        currentKnob: {
          ...currentKnob,
          ...data
        }
      }
    ));
  }
  const handleLoadFromDevice = () => {
    dispatch(setIsSyncing(true));
    midiOutput.sendSysex(32, [SYNC_KNOBS]);
    if (!sysExListener.current) {
      sysExListener.current = midiInput.addListener('sysex', handleSysEx);
    }
  }
  const handleFirmwareUpdate = () => {
    window.open("https://shik.tech/firmware-update/");
  }

  function handleOutputModeChange(outputMode) {
    dispatch(updateMidiOutput(outputMode.target.value));
  }

  function handleThruModeChange(thruMode) {
    dispatch(updateMidiThru(thruMode.target.value));
  }

  return (
    <Container maxWidth="lg">
      <SystemMessages
        closeDialog={handleCloseSystemDialog}
        showMessage={openMessageDialog}
        message={systemMessage}
      />
      <Box>
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
              </Stack>

              {deviceIsConnected && !firmwareVersion &&
                <Button
                  onClick={handleFirmwareUpdate}
                  color="error"
                >
                  Firmware Update
                </Button>
              }

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
                    handlePresetChange={handlePresetChange}
                  />

                  <SyncDevice
                    isSyncing={isSyncing}
                    firmwareVersion={firmwareVersion}
                    currentPreset={currentPreset}
                    currentDevicePresetIndex={currentPreset.presetID}
                    handlePresetChange={handlePresetChange}
                    handleLoadFromDevice={handleLoadFromDevice}
                  />
                </Stack>
              }
            </Stack>
          </Toolbar>
        </AppBar>

        {!deviceIsConnected &&
          <ConnectDevice />
        }

        {deviceIsConnected && firmwareVersion && currentPreset &&
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4}
            sx={{ mt: 2 }}
          >
            <Stack>
              <N32B
                knobsData={currentPreset.knobs}
                selectedKnobIndex={selectedKnobIndex}
                setSelectedKnob={handleSelectedKnobIndex}
              />
              <Version appVersion={appVersion} />
            </Stack>

            <Stack
              sx={{ flexGrow: 1 }}
              spacing={2}
            >
              {firmwareVersion[0] > 3 &&
                <>
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={4}
                    sx={{ mt: 2 }}
                  >
                    <ThruMode
                      thruMode={currentPreset.thruMode}
                      thruOptions={ThruOptions}
                      handleThruModeChange={handleThruModeChange}
                    />
                    <OutputMode
                      outputMode={currentPreset.outputMode}
                      outputOptions={OutputOptions}
                      handleOutputModeChange={handleOutputModeChange}
                    />
                  </Stack>
                  <Divider />
                </>
              }
              <Typography variant="h5" component="div" gutterBottom>
                Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span>
              </Typography>
              {firmwareVersion[0] < 30 &&
                <Editor
                  handleKnobDataChange={handleKnobDataChange}
                  currentKnob={currentPreset.knobs[selectedKnobIndex]}
                  firmwareVersion={firmwareVersion}
                />
              }
              {firmwareVersion[0] > 29 &&
                <SysExEditor
                  handleKnobDataChange={handleKnobDataChange}
                  currentKnob={currentPreset.knobs[selectedKnobIndex]}
                />
              }
            </Stack>
          </Stack>
        }
      </Box>
    </Container >
  );
}



export default App;
