import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box, Container, Grid, CircularProgress, Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewSale } from 'src/sections/overview/stats/overview-sale';
import { OverviewRevenue } from 'src/sections/overview/stats/overview-revenue';
import { OverviewBestSeller } from 'src/sections/overview/stats/overview-bestseller';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { OverviewSales } from 'src/sections/overview/overview-sales';


const Page = () => {
  const auth = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [perDaySales, setPerDaySales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topSellers, setTopSellers] = useState([]);
  const [announcements, setAnnouncement] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [taskCompletion, setTaskCompletion] = useState({
    configureAccount: false,
    configureIntegrations: false,
    configureAutomatedPricing: false,
    importShopify: false,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchStatistics();
    fetchAnnouncement();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`https://api.tcgsync.com:4000/api/inventory/v2/dashboard`, {
        params: {
          username: auth.user.username,
          region: auth.user.region,
        },
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      });

      const { data } = response.data;
      const { topSellers, totalQuantitySold, totalRevenue, salesDataForTable } = data;

      setStatsData({
        topSellers,
        totalQuantitySold: Number(totalQuantitySold),
        totalRevenue: Number(totalRevenue),
      });
      setPerDaySales(salesDataForTable);
      setTopSellers(topSellers);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch statistics. Please try again later.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(`https://api.tcgsync.com:4000/api/test/announcement/get`);
      setAnnouncement(response.data.announcement);
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Overview | TCGSync v2</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
      
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {announcements && announcements.message !== '' && (
                <div className="announcement">
                  <strong className="text-muted">Important: </strong>
                  {announcements.message}
                </div>
              )}
            </Grid>
            {isLoading ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              </Grid>
            ) : error ? (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewSale
                    sx={{ height: '100%' }}
                    value={statsData ? `${statsData.totalQuantitySold} ` : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewRevenue
                    sx={{ height: '100%' }}
                    value={statsData ? `£${statsData.totalRevenue.toFixed(2)}` : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={6}>
                  <OverviewBestSeller products={topSellers} announcements={announcements} />
                </Grid>
                <Grid item xs={12} lg={8}>
                  <OverviewSales
                    chartSeries={[
                      {
                        name: 'Sales',
                        data: perDaySales.sort((a, b) => new Date(a.day) - new Date(b.day)).map(dayData => ({
                          x: dayData.day,
                          y: dayData.sales
                        }))
                      }
                    ]}
                    sx={{ height: '100%' }}
                  />
                </Grid>
               
              </>
            )}
          </Grid>
        </Container>
      </Box>
      <div className="myCustomHeight">
    
  </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
