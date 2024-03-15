import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    username: '',
    password: '',
    posDomain: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // Current step of the form
  const [availabilityError, setAvailabilityError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    console.log(auth.user.posConfig);
    setAvailabilityError('');

    const testProvisioned = async () => {
      try {
        const response = await axios.get("https://testpos.tcgsyncpos.com");
        console.log(response);
        if (response.status === 200 && response.data.provisioned === true) {
          // POS is provisioned
          console.log("POS is provisioned");
          clearInterval(interval); // Stop the interval
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.code === "ERR_NETWORK") {
          // Network error, POS is likely not provisioned
          console.log("Network error: POS is not provisioned");
        } else {
          // Other error occurred, handle accordingly
          console.error("Other error:", error);
        }
      }
    };

    const interval = setInterval(testProvisioned, 30000); // Run every 30 seconds

    return () => {
      clearInterval(interval); // Cleanup: Stop the interval when component unmounts
    };
  }, [auth.user.posConfig]); // Run whenever auth.user.posConfig changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    // Perform validation based on field name
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          errors[name] = 'This field is required';
        } else {
          delete errors[name];
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors[name] = 'Email is required';
        } else if (!isValidEmail(value)) {
          errors[name] = 'Please enter a valid email address';
        } else {
          delete errors[name];
        }
        break;
      case 'companyName':
        if (!value.trim()) {
          errors[name] = 'Company name is required';
        } else {
          delete errors[name];
        }
        break;
      case 'username':
        if (!value.trim()) {
          errors[name] = 'Username is required';
        } else {
          delete errors[name];
        }
        break;
      case 'password':
        if (!value.trim()) {
          errors[name] = 'Password is required';
        } else if (!isValidPassword(value)) {
          errors[name] = 'Password must be at least 6 characters long and contain letters and numbers';
        } else {
          delete errors[name];
        }
        break;
      case 'posDomain':
        if (!value.trim()) {
          errors[name] = 'POS deployment domain is required';
        } else if (!value.endsWith('.tcgsyncpos.com')) {
          errors[name] = 'POS deployment domain must end with .tcgsyncpos.com';
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    // Password validation regex: at least 6 characters long and contain letters and numbers
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const formErrors = {};

    // Form validation for each step
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (fieldErrors[key]) {
        formErrors[key] = fieldErrors[key];
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setError('Please fill in all required fields correctly');
      setLoading(false);
      return;
    }

    try {
      // Prepare the complete configuration data
      const completeConfig = {
        ...auth.user, // Assuming auth.user contains the user's existing data
        posConfig: {
          ...formData,
        },
      };

      const response = await axios.post(
        'https://api.tcgsync.com:4000/api/user/updateprofile',
        completeConfig,
        {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );
      auth.updateUser(completeConfig);
      // Handle success response
      setSuccess(true);

    } catch (error) {
      setError('Failed to provision account');
      console.error('Error provisioning account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleLaunchPOS = () => {
    // Redirect to the POS link
    window.open(`https://${auth.user.posConfig.posDomain}`, '_blank');
  };
  

  if (auth.user.posConfig.firstName !== "") {
    return (
      <>
        <Head>
          <title>POS | TCGSync v2</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            {/* Display card with information */}
            <Stack spacing={3}>
              <Typography variant="h4">POS Configuration</Typography>
              <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
                <Typography variant="h6">User Information</Typography>
                <Typography>First Name: {auth.user.posConfig.firstName}</Typography>
                <Typography>Last Name: {auth.user.posConfig.lastName}</Typography>
                <Typography>Email: {auth.user.posConfig.email}</Typography>
                <Typography>Company Name: {auth.user.posConfig.companyName}</Typography>
                <Typography>Username: {auth.user.posConfig.username}</Typography>
                <Typography>Domain: {auth.user.posConfig.posDomain}</Typography>
                {/* Add other fields as needed */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>

                  {auth.user.posConfig.deployed == true ? <><Button variant="contained" onClick={handleLaunchPOS}>
                    Launch POS
                  </Button></> : <><CircularProgress /><Typography variant="body1" sx={{ marginLeft: 1 }}>Provisioning...</Typography></>}
        
                </Box>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                  Default login credentials: <strong>admin:tcgsync!</strong>
                </Typography>

              </Box>
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>POS | TCGSync v2</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">POS Configuration - Step {step}</Typography>
            {error && <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')} message={error} />}
            {availabilityError && <Snackbar open={true} autoHideDuration={6000} onClose={() => setAvailabilityError('')} message={availabilityError} />}
            {step === 1 && (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter your first name" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter your last name" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter your email address" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.companyName}
                  helperText={fieldErrors.companyName}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter your company name" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
              </>
            )}
            {step === 2 && (
              <>
                <TextField
                  label="Admin Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter the admin username" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
                <TextField
                  label="Admin Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Enter the admin password" arrow>
                        <></>
                      </Tooltip>
                    ),
                  }}
                />
              </>
            )}
            {step === 3 && (
              <TextField
                label="POS Deployment Domain"
                name="posDomain"
                value={formData.posDomain}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!fieldErrors.posDomain}
                helperText={fieldErrors.posDomain}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Enter the POS deployment domain ending with .tcgsyncpos.com" arrow>
                      <></>
                    </Tooltip>
                  ),
                }}
              />
            )}
            <Stack direction="row" spacing={2}>
              {step !== 1 && (
                <Button variant="contained" onClick={handlePrevStep}>
                  Previous
                </Button>
              )}
              {step !== 3 ? (
                <Button variant="contained" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Provision Account'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Provisioning..."
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
