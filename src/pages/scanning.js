import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Modal,
  TextField,
  FormGroup,
  Checkbox,
  IconButton,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import SettingsIcon from '@mui/icons-material/Settings';
import ImageIcon from '@mui/icons-material/Image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ScannerIcon from '@mui/icons-material/Scanner';

const gameOptions = {
  1: "Magic: The Gathering",
  2: "YuGiOh",
  3: "Pokemon",
  // Add more game options if needed
};

const conditionOptions = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];

const defaultSettings = {
  condition: 'Near Mint',
  language: 'English',
  standard: true,
  foil: false,
  reverseHolo: false,
  firstEdition: false,
  comment: '',
  batch: '',
  location: '',
};

const ConfigurationModal = ({ open, handleClose, settings, setSettings }) => {
  const handleConditionChange = (event) => {
    setSettings({ ...settings, condition: event.target.value });
  };

  const handleLanguageChange = (event) => {
    setSettings({ ...settings, language: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSettings({ ...settings, [name]: checked });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Configuration</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Condition</InputLabel>
          <Select value={settings.condition} onChange={handleConditionChange} fullWidth>
            {conditionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Language</InputLabel>
          <Select value={settings.language} onChange={handleLanguageChange} fullWidth>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            {/* Add more language options if needed */}
          </Select>
        </FormControl>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={settings.standard} onChange={handleCheckboxChange} name="standard" />} label="Standard" />
          <FormControlLabel control={<Checkbox checked={settings.foil} onChange={handleCheckboxChange} name="foil" />} label="Foil" />
          <FormControlLabel control={<Checkbox checked={settings.reverseHolo} onChange={handleCheckboxChange} name="reverseHolo" />} label="Reverse Holo" />
          <FormControlLabel control={<Checkbox checked={settings.firstEdition} onChange={handleCheckboxChange} name="firstEdition" />} label="First Edition" />
        </FormGroup>
        <TextField label="Comment" value={settings.comment} onChange={(e) => setSettings({ ...settings, comment: e.target.value })} fullWidth margin="normal" />
        <TextField label="Batch" value={settings.batch} onChange={(e) => setSettings({ ...settings, batch: e.target.value })} fullWidth margin="normal" />
        <TextField label="Location" value={settings.location} onChange={(e) => setSettings({ ...settings, location: e.target.value })} fullWidth margin="normal" />
        <Button onClick={handleClose} variant="contained" fullWidth>Confirm</Button>
      </Box>
    </Modal>
  );
};

const ImageUploadSection = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = event.target.files;

    // Convert each selected image file to base64
    const imagesArray = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    // Once all promises are resolved, update state with base64 images
    Promise.all(imagesArray)
      .then((base64Images) => {
        setSelectedImages((prevImages) => prevImages.concat(base64Images));
      })
      .catch((error) => {
        console.error('Error converting images to base64:', error);
      });
  };

  const handleClearImages = () => {
    setSelectedImages([]);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Image Upload Section
      </Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center">
        {selectedImages.map((image, index) => (
          <img key={index} src={image} alt={`Uploaded Image ${index}`} style={{ width: '150px', height: '150px', margin: '5px' }} />
        ))}
      </Box>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span">
          Upload Images
        </Button>
      </label>
      {selectedImages.length > 0 && (
        <Button variant="outlined" onClick={handleClearImages} style={{ marginTop: '10px' }}>
          Clear Images
        </Button>
      )}
    </div>
  );
};

const LiveCameraSection = () => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDevice(videoInputDevices[0].deviceId);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error enumerating video devices:', error);
        setLoading(false);
      }
    };

    getVideoDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDevice } })
        .then((userStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = userStream;
            setStream(userStream);
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }, [selectedDevice]);

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Live Camera
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : videoDevices.length === 0 ? (
        <Typography variant="body1">No camera sources available.</Typography>
      ) : (
        <div>
          <FormControl fullWidth>
            <InputLabel>Select Camera</InputLabel>
            <Select value={selectedDevice} onChange={handleDeviceChange}>
              {videoDevices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <video ref={videoRef} width="100%" height="auto" autoPlay></video>
          </div>
        </div>
      )}
    </div>
  );
};

const LiveScannerSection = () => {
  // Add live scanner functionality here
  return (
    <Typography variant="body1">Live Scanner Section</Typography>
  );
};

const Page = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [scanMode, setScanMode] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const handleScanModeChange = (mode) => {
    setScanMode(mode);
    setIsConfiguring(true);
    setConfigOpen(true);
  };

  const handleConfigClose = () => {
    setConfigOpen(false);
    setIsConfiguring(false);
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <Typography variant="h4">Scanning</Typography>
        {!isConfiguring && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select a Game</InputLabel>
                <Select value={selectedGame} onChange={handleGameChange} fullWidth>
                  {Object.entries(gameOptions).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" fullWidth startIcon={<ImageIcon />} onClick={() => handleScanModeChange('file')}>
                File Input
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" fullWidth startIcon={<CameraAltIcon />} onClick={() => handleScanModeChange('liveCamera')}>
                Live Camera
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" fullWidth startIcon={<ScannerIcon />} onClick={() => handleScanModeChange('liveScanner')}>
                Live Scanner
              </Button>
            </Grid>
          </Grid>
        )}
        {isConfiguring && <ConfigurationModal open={configOpen} handleClose={handleConfigClose} settings={settings} setSettings={setSettings} />}
        {isConfiguring && (
          <IconButton onClick={handleConfigClose} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            <SettingsIcon />
          </IconButton>
        )}
        {scanMode === 'file' && <ImageUploadSection />}
        {scanMode === 'liveCamera' && <LiveCameraSection />}
        {scanMode === 'liveScanner' && <LiveScannerSection />}
      </Stack>
    </Container>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
