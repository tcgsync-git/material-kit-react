import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { Alert } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const auth = useAuth();
  const [shopifyStoreName, setShopifyStoreName] = useState(auth.user.shopifyStoreName || '');
  const [shopifyAccessToken, setShopifyAccessToken] = useState(auth.user.shopifyAccessToken || '');
  const [storeLink, setStoreLink] = useState('');
  const [collabAccessCode, setCollabAccessCode] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitted, setIsSubmitted] = useState(false); // Flag to track whether the request has been submitted

  useEffect(() => {
    // Update state with user's Shopify store name and access token when auth.user changes
    setShopifyStoreName(auth.user.shopifyStoreName || '');
    setShopifyAccessToken(auth.user.shopifyAccessToken || '');
  }, [auth.user]);

  const sendDiscordEmbed = async () => {
    const webhookUrl = 'https://discord.com/api/webhooks/1217806901429932082/uFf-Y748mRBLwnXUfwsmYnHarYpFD49yhKtHzay8ONDw4gUID7z-1d4kwwRtP1nIPnsY';

    const embedMessage = {
      embeds: [
        {
          title: `Private App Request - ${auth.user.username}`,
          description: `**Shopify Store Link:** ${storeLink}\n**Collab Access Code:** ${collabAccessCode}\n**Description:** ${description}\n**Time:** ${new Date().toLocaleString()}`,
          color: 0x0099ff, // Blue color
        },
      ],
    };

    try {
      await axios.post(webhookUrl, embedMessage);
    } catch (error) {
      console.error('Error sending Discord embed message:', error);
    }
  };

  const handleManualSetup = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Manual setup submitted successfully.');
      setSnackbarOpen(true);
      console.log('Manual Setup Submitted:', shopifyStoreName, shopifyAccessToken);

      // Save the store name and access token to auth.user
      const updatedUser = { ...auth.user, shopifyStoreName, shopifyAccessToken };
      const response = await axios.post(
        'https://api.tcgsync.com:4000/api/user/updateprofile',
        updatedUser,
        {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );
      auth.updateUser(updatedUser);
    } catch (error) {
      setLoading(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to submit manual setup. Please try again.');
      setSnackbarOpen(true);
      console.error('Error submitting manual setup:', error);
    }
  };

  const handlePrivateAppRequest = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Private app request submitted successfully.');
      setSnackbarOpen(true);
      console.log('Private App Request Submitted:', storeLink, collabAccessCode, description);

      // Send Discord embed message
      sendDiscordEmbed();

      // Set flag in local storage
      localStorage.setItem('privateAppRequestSubmitted', 'true');
      setIsSubmitted(true); // Update state to reflect submission
    } catch (error) {
      setLoading(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to submit private app request. Please try again.');
      setSnackbarOpen(true);
      console.error('Error submitting private app request:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Check if private app request has been submitted previously
    const isAlreadySubmitted = localStorage.getItem('privateAppRequestSubmitted');
    if (isAlreadySubmitted) {
      setIsSubmitted(true); // Disable submission button if already submitted
    }
  }, []);

  return (
    <>
      <Head>
        <title>Shopify | TCGSync v2</title>
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
            <Typography variant="h4">Shopify</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6">Manual Setup</Typography>
                  <Tooltip title="Enter the name of your Shopify store as it appears in your account settings">
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Shopify Store Name"
                      value={shopifyStoreName}
                      onChange={(e) => setShopifyStoreName(e.target.value)}
                    />
                  </Tooltip>
                  <Tooltip title="Generate an access token in your Shopify admin settings. This token is required to authenticate your store's access to the app.">
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Shopify Access Token"
                      value={shopifyAccessToken}
                      onChange={(e) => setShopifyAccessToken(e.target.value)}
                    />
                  </Tooltip>
                  <Button variant="contained" color="primary" onClick={handleManualSetup} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    To obtain your Shopify Store Name and Access Token:
                    <ol>
                      <li>Log in to your Shopify admin dashboard.</li>
                      <li>Go to Settings &rarr; General.</li>
                      <li>Scroll down to the Store details section to find your store name.</li>
                      <li>Go to Apps &rarr; Manage private apps.</li>
                      <li>Create a new private app and enable all scopes related to orders, products, inventory, and customers (This is only required if you wish to manage store credit).</li>
                      <li>Generate an access token and copy it.</li>
                    </ol>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6">Private App Request</Typography>
                  <Tooltip title="Provide the link to your Shopify store (e.g., https://yourstore.myshopify.com)">
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Shopify Store Link"
                      value={storeLink}
                      onChange={(e) => setStoreLink(e.target.value)}
                    />
                  </Tooltip>
                  <Tooltip title="If applicable, provide the collaboration access code provided by your team.">
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Collab Access Code"
                      value={collabAccessCode}
                      onChange={(e) => setCollabAccessCode(e.target.value)}
                    />
                  </Tooltip>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    We aim to process private app requests within 24 hours, but it often takes less time.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrivateAppRequest}
                    disabled={loading || isSubmitted} // Disable button if already submitted
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
