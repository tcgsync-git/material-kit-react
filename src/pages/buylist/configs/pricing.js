import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import { HexColorPicker } from 'react-colorful';
import NextLink from 'next/link';
import { EmailOutlined, NextPlanOutlined, PageviewOutlined, PriceChangeOutlined, SettingsCellOutlined, StyleOutlined } from '@mui/icons-material';
import axios from 'axios';

const Page = () => {
  const [auth, setAuth] = useState(useAuth());
  const [storeId, setStoreId] = useState(useAuth());
  const [storeConfig, setStoreConfig] = useState({
    enabledGames: [],
    pageSize: 16,
    notBuyingLabel: '',
    checkoutMessage: '',
    inboundEmail: '',
    outboundEmail: '',
    notificationEmail: '',
    defaultDenyMessage: '',
    defaultAcceptMessage: '',
    autoApproveOrders: false,
    storeLogoUrl: '',
    backgroundColor: '',
    cartButtonColor: '',
    cashButtonColor: '',
    creditButtonColor: '',
    storeCurrency: 'USD',
    bulkPrices: {},
    buylistConfig: {
      enableCash: false,
      enableCredit: false,
      enableInventoryPrice: false,
      enablePostalOrders: false,
      cashBuyrate: 0,
      creditBuyrate: 0,
      minimumBuyPrice: 0,
      maximumBuyQuantity: 0,
    },
  });

  useEffect(() => {
    fetchStore();
  }, [auth.user.accessToken]);

  const fetchStore = async () => {
    try {
      const response = await axios.get('https://api.tcgsync.com:4000/api/buylist/store/find', {
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      });

      if (response.status === 200) {
        const storeData = response.data.store;
        console.log(storeData)
        setStoreId(storeData.storeID)
        console.log(storeId)
        setStoreConfig({
          ...storeData.storeConfig,
          buylistConfig: {
            ...storeData.buylistConfig,
          },
        });
      } else {
        console.error('Failed to fetch store data');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const handlePriceChange = (event, fieldName) => {
    const { value } = event.target;
    setStoreConfig((prevConfig) => ({
      ...prevConfig,
      buylistConfig: {
        ...prevConfig.buylistConfig,
        [fieldName]: parseFloat(value),
      },
    }));
  };

  const [bottomNavValue, setBottomNavValue] = useState("pricingconfig");

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  const gotoBuylist = () => {
    window.open(`https://buylist.tcgsync.com?store_id=${storeId}`, '_blank');
  };
  return (
    <Container maxWidth="xl">
      <br />
      <Stack spacing={3} sx={{ mt: 4 }}>
        <Typography variant="h5">Pricing</Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cash Buyrate (%)"
                type="number"
                name="buylistConfig.cashBuyrate"
                value={storeConfig.buylistConfig.cashBuyrate}
                onChange={(e) => handlePriceChange(e, 'cashBuyrate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Buyrate (%)"
                type="number"
                name="buylistConfig.creditBuyrate"
                value={storeConfig.buylistConfig.creditBuyrate}
                onChange={(e) => handlePriceChange(e, 'creditBuyrate')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Buy Price"
                type="number"
                name="buylistConfig.minimumBuyPrice"
                value={storeConfig.buylistConfig.minimumBuyPrice}
                onChange={(e) => handlePriceChange(e, 'minimumBuyPrice')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Buy Quantity"
                type="number"
                name="buylistConfig.maximumBuyQuantity"
                value={storeConfig.buylistConfig.maximumBuyQuantity}
                onChange={(e) => handlePriceChange(e, 'maximumBuyQuantity')}
              />
            </Grid>
          </Grid>
        </Paper>
      </Stack>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={bottomNavValue}
          onChange={handleBottomNavChange}
        >
          <BottomNavigationAction label="Buylist Orders" value="vieworders" component={NextLink} href='/buylist/orders' icon={<PageviewOutlined />} />
          <BottomNavigationAction label="General Config" value="generalconfig" component={NextLink} href='/buylist/configs/general' icon={<SettingsCellOutlined />} />
          <BottomNavigationAction label="Pricing Config" value="pricingconfig" component={NextLink} href='/buylist/configs/pricing' icon={<PriceChangeOutlined />} />
          <BottomNavigationAction label="Email Config" value="emailconfig" component={NextLink} href='/buylist/configs/email' icon={<EmailOutlined />} />
          <BottomNavigationAction label="Apperance Config" value="apperanceconfig" component={NextLink} href='/buylist/configs/apperance' icon={<StyleOutlined />} />
          <BottomNavigationAction label="Goto Buylist" value="gotoBuylist" icon={<NextPlanOutlined />} onClick={gotoBuylist} />
        </BottomNavigation>
      </Paper>
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
