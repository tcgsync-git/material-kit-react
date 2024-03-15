import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Grid, Typography, CircularProgress, TextField, Paper, MenuItem } from '@mui/material';
import axios from 'axios';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import BankingDetails from 'src/sections/banking/banking-details'; // Import the BankingDetails component

const Page = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [fundsAvailable, setFundsAvailable] = useState(0);
  const [fundsPending, setFundsPending] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [region, setRegion] = useState('');
  const [openModal, setOpenModal] = useState(false); // State to control modal open/close
  const [error, setError] = useState(null);
  const [transactionReference, setTransactionReference] = useState('');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.tcgsync.com:4000/api/inventory/sales/fbt`, {
        params: {
          username: auth.user.username,
          region: auth.user.region,
        },
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      });
      const items = response.data.data.results;

      let totalPending = 0;
      let totalAvailable = 0;

      if (items.length > 0) {
        const currentDate = new Date();

        items.forEach((item) => {
          const sales = item.sales;
          sales.forEach((sale) => {
            if (!isNaN(sale.price) && sale.price !== 0 && sale.price !== "" && sale.price !== null) {
              const adjustedPrice = sale.source === 'cardtrader' ? sale.price / 100 : sale.price;

              const createdAtDate = new Date(sale.createdAt);
              const minDate = new Date('2024-02-01');
              const daysDifference = Math.ceil((currentDate - createdAtDate) / (1000 * 60 * 60 * 24));

              let totalPayout = adjustedPrice - calculateMarketplaceFee(adjustedPrice * sale.quantityToDeduct) - calculateTcgSyncFee(adjustedPrice * sale.quantityToDeduct);

              if (daysDifference < 7) {
                totalPending += totalPayout;
              } else {
                totalAvailable += totalPayout;
              }
            }
          });
        });
      }

      setFundsPending(totalPending);
      setFundsAvailable(totalAvailable);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setLoading(false);
      setError('Error fetching sales data. Please try again later.');
    }
  };

  const calculateMarketplaceFee = (price) => Math.max(price * 0.07, 0.02);
  const calculateTcgSyncFee = (price) => Math.max(price * 0.05, 0.10);

  const handleWithdrawal = () => {
    setError(null);

    // Validate withdrawal amount
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount)) || Number(withdrawalAmount) <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }

    // Validate region selection
    if (!region) {
      setError('Please select a region for your bank details.');
      return;
    }

    // Convert withdrawal amount to a number
    const withdrawalAmountNumber = Number(withdrawalAmount);

    // Check if withdrawal amount exceeds available funds
    if (withdrawalAmountNumber > fundsAvailable) {
      setError('Withdrawal amount exceeds available funds.');
      return;
    }

    // Generate transaction reference
    const reference = generateTransactionReference();
    setTransactionReference(reference);

    // Open modal for bank details
    setOpenModal(true);
  };

  const generateTransactionReference = () => {
    // Generate a random alphanumeric transaction reference
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let reference = '';
    for (let i = 0; i < length; i++) {
      reference += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return reference;
  };

  const handleModalSubmit = (bankDetails) => {
    // Submit bank details along with transaction reference and amount
    console.log('Bank Details:', bankDetails);
    console.log('Transaction Reference:', transactionReference);
    console.log('Withdrawal Amount:', withdrawalAmount);
    setOpenModal(false);
  };

  return (
    <>
      <Head>
        <title>Banking | TCGSync v2</title>
      </Head>
      <Container maxWidth="xl">
        <Box py={8}>
          <Typography variant="h4" gutterBottom>
            Banking <Typography color={"error"}>{error}</Typography>
          </Typography>
          <Box mb={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5">Funds Available: ${fundsAvailable}</Typography>
            </Paper>
          </Box>
          <Box mb={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5">Funds Pending: ${fundsPending.toFixed(2)}</Typography>
            </Paper>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Withdrawal Amount"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Region"
                  variant="outlined"
                  fullWidth
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="CANADA">Canada</MenuItem>
                  <MenuItem value="EU">EU</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleWithdrawal}
                >
                  Withdraw Funds
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
      <BankingDetails
        open={openModal}
        onClose={() => setOpenModal(false)}
        region={region}
        onSubmit={handleModalSubmit}
        amount={withdrawalAmount}
        transactionReference={transactionReference}
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
