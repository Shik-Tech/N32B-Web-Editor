import React, { useEffect, useRef, useState } from 'react';
import { findIndex, isEmpty } from 'lodash';
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
  ThruMode
} from './components';
import defaultPresets from './presetTemplates/default';
import sysExPreset from './presetTemplates/default/sysEx.json';
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
import { validateValueRange } from './components/UpdateDevice/utils';
import { ModeIndexes } from './components/Editor/Modes';
import { SEND_FIRMWARE_VERSION, SET_THRU_MODE, SYNC_KNOBS } from './components/UpdateDevice/commands';
import { ThruOptions } from './components/ThruMode/ThruOptions';
import { useData, useDataDispatch } from './reducer/context';

function App() {
  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  // const [currentPreset, updatePreset] = useState();
  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  // const [knobsData, setKnobsData] = useState();
  const [currentDevicePresetIndex, updateCurrentDevicePresetIndex] = useState(0);
  // const [firmwareVersion, setFirmwareVersion] = useState();
  const [midiDeviceName, setMidiDeviceName] = useState();
  const [systemMessage, setSystemMessage] = useState();
  const [openMessageDialog, setMessageDialog] = useState(false);
  const dispatch = useDataDispatch();
  const {
    currentPreset,
    firmwareVersion
  } = useData();

  // const knobsDataRef = useRef();
  // const firmwareVersionRef = useRef();
  const appVersion = 'v2.2.1';

  // knobsDataRef.current = knobsData;
  // firmwareVersionRef.current = firmwareVersion;

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (event) {
        if (WebMidi.getInputByName("N32B")) {
          setMidiInput(WebMidi.getInputByName("N32B"));
          setMidiOutput(WebMidi.getOutputByName("N32B"));
          setDeviceIsConnected(true);
        }
      });

      WebMidi.addListener("disconnected", function (event) {
        setDeviceIsConnected(false);
        // setFirmwareVersion(null);
        updateCurrentDevicePresetIndex(0);
        // setKnobsData(null);
        setMidiInput(null);
        setMidiOutput(null);
      });
    }, true);
  });

  useEffect(() => {
    if (midiOutput && midiInput) {
      midiInput.addListener('programchange', undefined, handleProgramChange);
      midiInput.addListener('sysex', 'all', handleSysex);
      handleGetDeviceFirmwareVersion();
      setMidiDeviceName(midiOutput.name);

      return () => {
        midiInput.removeListener('programchange', undefined, handleProgramChange);
        midiInput.removeListener('sysex', undefined, handleSysex);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiOutput, midiInput]);

  // useEffect(() => {
  //   if (isEmpty(knobsData)) return;
  //   updatePreset(prev => ({
  //     ...prev,
  //     knobs: [...knobsData]
  //   }));
  // }, [knobsData]);

  useEffect(() => {
    // updatePreset(prev => ({
    //   ...prev,
    //   presetID: currentDevicePresetIndex
    // }));

    if (midiOutput) {
      midiOutput.sendProgramChange(currentDevicePresetIndex, 1);
    }
  }, [currentDevicePresetIndex, midiOutput]);

  useEffect(() => {
    if (firmwareVersion) {
      if (firmwareVersion[0] > 29) {
        // updatePreset(sysExPreset);
        dispatch({
          type: "setData",
          data: {
            ...sysExPreset
          }
        });
        // setKnobsData(sysExPreset.knobs);
      } else if (firmwareVersion[0] < 4) {
        // updatePreset(defaultPresets.defaultPreset_v3);
        dispatch({
          type: "setData",
          data: {
            ...defaultPresets.defaultPreset_v3
          }
        });
        // setKnobsData(defaultPresets.defaultPreset_v3.knobs);
      } else {
        // updatePreset(defaultPresets.defaultPreset_v4);
        dispatch({
          type: "setData",
          data: {
            ...defaultPresets.defaultPreset_v4
          }
        });
        // setKnobsData(defaultPresets.defaultPreset_v4.knobs);
      }
    }
  }, [firmwareVersion]);

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
          (firmwareVersion[0] < 30 && preset.presetVersion > 2)
        ) {
          setSystemMessage('The preset version is not matching the device firmware.');
          setMessageDialog(true);
          return;
        } else {
          // setKnobsData(preset.knobs);
          // updatePreset(prev => ({
          //   ...prev,
          //   ...preset
          // }))
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

  function handleKnobDataChange(data) {
    // setKnobsData(prevKnobsData => prevKnobsData.map((knobData, index) => {
    //   if (index === selectedKnobIndex) {
    //     return {
    //       ...knobData,
    //       ...data
    //     }
    //   } else {
    //     return knobData;
    //   }
    // }));
  }

  const handleCloseSystemDialog = () => {
    setMessageDialog(false);
    setSystemMessage(null);
  }

  function handleReadFromDevice(data, knobIndex) {
    // setKnobsData(prevKnobsData => [
    //   ...prevKnobsData.slice(0, knobIndex),
    //   {
    //     ...prevKnobsData[knobIndex],
    //     ...data
    //   },
    //   ...prevKnobsData.slice(knobIndex + 1)
    // ]);
  }

  const handleProgramChange = event => {
    updateCurrentDevicePresetIndex(event.data[1]);
  }

  const handleSysex = event => {
    const {
      dataBytes,
      message: {
        manufacturerId
      }
    } = event;
    let knobData = {};
    if (manufacturerId[0] === 32) {
      switch (dataBytes[0]) {
        case SEND_FIRMWARE_VERSION:
          if (dataBytes.length > 2) {
            // setFirmwareVersion(dataBytes.slice(1));
            dispatch({
              type: "setFirmwareVersion",
              firmwareVersion: dataBytes.slice(1)
            });
          }
          break;
        case SYNC_KNOBS:
          if (dataBytes.length > 7) {
            const knobIndex = findIndex(currentPreset.knobs, knob => knob.hardwareId === dataBytes[1]);
            if (knobIndex > -1) {
              switch (firmwareVersion[0]) {
                case this < 30:
                  knobData = {
                    ...currentPreset.knobs[knobIndex],
                    mode: dataBytes[5],
                    msb: dataBytes[2],
                    lsb: dataBytes[3],
                    channel: dataBytes[4],
                    invert_a: Boolean(dataBytes[6]),
                    invert_b: Boolean(dataBytes[7])
                  };
                  break;

                default:
                  break;
              }
              if (firmwareVersion[0] < 30) {
                // knobData = {
                //   ...knobsDataRef.current[knobIndex],
                //   mode: dataBytes[5],
                //   msb: dataBytes[2],
                //   lsb: dataBytes[3],
                //   channel: dataBytes[4],
                //   invert_a: Boolean(dataBytes[6]),
                //   invert_b: Boolean(dataBytes[7])
                // };
              } else {
                knobData = {
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
                  knobData.sysExMessage.push(dataBytes[byteIndex + 10].toString(16).padStart(2, '0'));
                }
              }
              // handleReadFromDevice(knobData, knobIndex);
              dispatch({
                type: "setKnob",
                currentKnob: {
                  ...knobData
                }
              })
            }
          }
          break;

        case SET_THRU_MODE:
          const thruMode = dataBytes[1];
          // updatePreset(prev => ({
          //   ...prev,
          //   thruMode
          // }));
          break;

        default:
          break;
      }
    }
  }

  function handleSysExChange(sysExMessage) {
    if (sysExMessage.length > 10) return; // Limit sysEx data
    handleKnobDataChange({ sysExMessage });
  }

  function handleSysExMSBLSBSwitch() {
    handleKnobDataChange({
      MSBFirst: !currentPreset.knobs[selectedKnobIndex].MSBFirst
    });
  }

  function handleSysExValuesIndexChange(valuesIndex) {
    handleKnobDataChange({
      valuesIndex
    });
  }
  function handleIsSignedChange(event) {
    const isSigned = event.target.checked;
    const minValue = isSigned ? 0 : currentPreset.knobs[selectedKnobIndex].minValue;
    const maxValue =
      isSigned && currentPreset.knobs[selectedKnobIndex].maxValue > 127 ?
        127 : currentPreset.knobs[selectedKnobIndex].maxValue;
    handleKnobDataChange({
      isSigned,
      minValue,
      maxValue
    });
  }

  function handleMinValueChange(event) {
    handleKnobDataChange({
      minValue: validateValueRange(event.target)
    });
  }
  function handleMaxValueChange(event) {
    handleKnobDataChange({
      maxValue: validateValueRange(event.target)
    });
  }
  function handleModeSelect(event) {
    let newData = {
      mode: parseInt(event.target.value)
    };
    if (newData.mode === ModeIndexes.KNOB_MODE_HIRES) {
      if (currentPreset.knobs[selectedKnobIndex].msb > 31) {
        newData = {
          ...newData,
          msb: 0,
          lsb: 32
        }
      } else {
        newData = {
          ...newData,
          lsb: currentPreset.knobs[selectedKnobIndex].msb + 32
        }
      }
    }
    handleKnobDataChange(newData);
  }

  function handleChannelChange(event) {
    handleKnobDataChange({
      channel: parseInt(event.target.value)
    });
  }

  function handleChannelAChange(event) {
    handleKnobDataChange({
      channel_a: parseInt(event.target.value)
    });
  }

  function handleChannelBChange(event) {
    handleKnobDataChange({
      channel_b: parseInt(event.target.value)
    });
  }

  function handleMinAChange(event) {
    handleKnobDataChange({
      min_a: parseInt(event.target.value)
    });
  }
  function handleMaxAChange(event) {
    handleKnobDataChange({
      max_a: parseInt(event.target.value)
    });
  }
  function handleMinBChange(event) {
    handleKnobDataChange({
      min_b: parseInt(event.target.value)
    });
  }
  function handleMaxBChange(event) {
    handleKnobDataChange({
      max_b: parseInt(event.target.value)
    });
  }

  function handleMSBChange(event) {
    handleKnobDataChange({
      msb: validateValueRange(event.target)
    });
  }
  function handleLSBChange(event) {
    handleKnobDataChange({
      lsb: validateValueRange(event.target)
    });
  }

  function handleHiResChange(event) {
    handleKnobDataChange({
      msb: validateValueRange(event.target),
      lsb: validateValueRange(event.target) + 32
    });
  }

  function handleInvertValueAChange(event) {
    handleKnobDataChange({
      invert_a: event.target.checked
    });
  }

  function handleInvertValueBChange(event) {
    handleKnobDataChange({
      invert_b: event.target.checked
    });
  }
  const handleGetDeviceFirmwareVersion = () => {
    midiOutput.sendSysex(32, [SEND_FIRMWARE_VERSION]);
  }
  const handleLoadFromDevice = () => {
    midiOutput.sendSysex(32, [SYNC_KNOBS]);
  }
  const handleFirmwareUpdate = () => {
    window.open("https://shik.tech/firmware-update/");
  }

  function handleThruModeChange(thruMode) {
    // updatePreset(prev => ({
    //   ...prev,
    //   thruMode: thruMode.target.value
    // }));
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
                    currentDevicePresetIndex={currentDevicePresetIndex}
                    updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
                  />

                  <SyncDevice
                    firmwareVersion={firmwareVersion}
                    currentPreset={currentPreset}
                    currentDevicePresetIndex={currentDevicePresetIndex}
                    updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
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
                setSelectedKnob={setSelectedKnobIndex}
              />
              <Version appVersion={appVersion} />
            </Stack>

            <Stack
              sx={{ flexGrow: 1 }}
              spacing={2}
            >
              {firmwareVersion[0] > 3 &&
                <>
                  <ThruMode
                    thruMode={currentPreset.thruMode}
                    thruOptions={ThruOptions}
                    handleThruModeChange={handleThruModeChange}
                  />
                  <Divider />
                </>
              }
              <Typography variant="h5" component="div" gutterBottom>
                Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span>
              </Typography>
              {firmwareVersion[0] < 30 &&
                <Editor
                  currentKnob={currentPreset.knobs[selectedKnobIndex]}
                  handleChannelChange={handleChannelChange}
                  handleChannelAChange={handleChannelAChange}
                  handleChannelBChange={handleChannelBChange}
                  handleMinAChange={handleMinAChange}
                  handleMaxAChange={handleMaxAChange}
                  handleMinBChange={handleMinBChange}
                  handleMaxBChange={handleMaxBChange}
                  handleMSBChange={handleMSBChange}
                  handleLSBChange={handleLSBChange}
                  handleInvertValueAChange={handleInvertValueAChange}
                  handleInvertValueBChange={handleInvertValueBChange}
                  handleHiResChange={handleHiResChange}
                  handleModeSelect={handleModeSelect}
                  firmwareVersion={firmwareVersion}
                  dispatch={dispatch}
                />
              }
              {firmwareVersion[0] > 29 &&
                <SysExEditor
                  currentKnob={currentPreset.knobs[selectedKnobIndex]}
                  handleSysExChange={handleSysExChange}
                  handleSysExMSBLSBSwitch={handleSysExMSBLSBSwitch}
                  handleMinValueChange={handleMinValueChange}
                  handleMaxValueChange={handleMaxValueChange}
                  handleSysExValuesIndexChange={handleSysExValuesIndexChange}
                  handleIsSignedChange={handleIsSignedChange}
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
