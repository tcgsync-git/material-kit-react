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
import { EmailOutlined, NextPlan, NextPlanOutlined, PageviewOutlined, PriceChangeOutlined, SettingsCellOutlined, StyleOutlined } from '@mui/icons-material';
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setStoreConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (color, fieldName) => {
    setStoreConfig((prevConfig) => ({
      ...prevConfig,
      [fieldName]: color.hex,
    }));
  };

  const [bottomNavValue, setBottomNavValue] = useState("emailconfig");

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
        <Typography variant="h5">Email</Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inbound Email"
                name="inboundEmail"
                value={storeConfig.inboundEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Outbound Email"
                name="outboundEmail"
                value={storeConfig.outboundEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notification Email"
                name="notificationEmail"
                value={storeConfig.notificationEmail}
                onChange={handleChange}
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
