import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Stack, Typography, Box, Button, SvgIcon, TextField, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Chip } from '@mui/material';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const API_URL_LIST = {
  CARDMARKET_ORDERS: 'https://api.tcgsync.com:4000/api/orders/cardmarket',
  MANAPOOL_ORDERS: 'https://api.tcgsync.com:4000/api/orders/manapool',
  CARDTRADER_ORDERS: 'https://api.tcgsync.com:4000/api/orders/cardtrader',
  SHOPIFY_ORDERS: 'https://api.tcgsync.com:4000/api/orders/shopify',
};

const Page = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({ Cardmarket: [], Cardtrader: [], Shopify: [], Manapool: [] });
  const [nameNumberFilter, setNameNumberFilter] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (selectedTab !== null) {
      fetchSalesData();
    }
  }, [selectedTab]); 

  useEffect(() => {
    if (!nameNumberFilter) {
      setFilteredOrders(salesData[getPlatformFromIndex(selectedTab)]);
    } else {
      const filtered = salesData[getPlatformFromIndex(selectedTab)].filter(order =>
        order.idOrder.toString().includes(nameNumberFilter) ||
        getOrderDate(order).toString().includes(nameNumberFilter) ||
        getOrderTotal(order).toString().includes(nameNumberFilter) ||
        getOrderStatus(order).toLowerCase().includes(nameNumberFilter.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [nameNumberFilter, salesData, selectedTab]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        getAPIUrl(selectedTab),
        {
          params: {
            username: auth.user.username,
          },
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );
      if (selectedTab === 0 || selectedTab === 1 || selectedTab === 3) {
        setSalesData(prevState => ({
          ...prevState,
          [getPlatformFromIndex(selectedTab)]: response.data.data.orders,
        }));
      } else if (selectedTab === 2) {
        setSalesData(prevState => ({
          ...prevState,
          [getPlatformFromIndex(selectedTab)]: response.data.data,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setLoading(false);
    }
  };

  const handleNameNumberFilterChange = (event) => {
    setNameNumberFilter(event.target.value);
  };

  const handleTabChange = async (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getPlatformFromIndex = (index) => {
    switch (index) {
      case 0:
        return 'Cardmarket';
      case 1:
        return 'Cardtrader';
      case 2:
        return 'Shopify';
      case 3:
        return 'Manapool';
      default:
        return '';
    }
  };

  const getAPIUrl = (index) => {
    switch (index) {
      case 0:
        return API_URL_LIST.CARDMARKET_ORDERS;
      case 1:
        return API_URL_LIST.CARDTRADER_ORDERS;
      case 2:
        return API_URL_LIST.SHOPIFY_ORDERS;
      case 3:
        return API_URL_LIST.MANAPOOL_ORDERS;
      default:
        return '';
    }
  };

  const renderOrdersTable = () => {
    const platformData = filteredOrders;
    if (!Array.isArray(platformData)) {
      return null; // Return null if data is not an array
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {platformData.map((order, index) => (
              <TableRow key={index} onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                <TableCell component="th" scope="row">{getOrderID(order)}</TableCell>
                <TableCell>{getOrderDate(order)}</TableCell>
                <TableCell>{getOrderTotal(order)}</TableCell>
                <TableCell>
                  <Chip label={getOrderStatus(order)} color={getOrderStatusColor(getOrderStatus(order))} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getOrderID = (order) => {
    if (!order) return '';
    switch (selectedTab) {
      case 0: // Cardmarket
        return order.idOrder;
      case 1: // Cardtrader
        return order.idOrder;
      case 2: // Manapool (Website)
        return order.id; // Assuming id is the order ID for Manapool
      case 3: // Manapool
        return order.id;
      default:
        return '';
    }
  };

  const getOrderDate = (order) => {
    if (!order) return '';
    switch (selectedTab) {
      case 0: // Cardmarket
        return order.state?.dateBought;
      case 1: // Cardtrader
        return order.state?.dateBought;
      case 2: // Manapool (Website)
        return order.created_at; // Assuming created_at is the order date for Manapool
      case 3: // Manapool
        return order.created_at;
      default:
        return '';
    }
  };

  const getOrderTotal = (order) => {
    if (!order) return '';
    switch (selectedTab) {
      case 0: // Cardmarket
        return order.totalValue;
      case 1: // Cardtrader
        return order.totalValue;
      case 2: // Manapool (Website)
        return order.current_total_price; // Assuming totalValue is the order total for Manapool
      case 3: // Manapool
        return order.totalValue;
      default:
        return '';
    }
  };

  const getOrderStatus = (order) => {
    if (!order) return '';
    switch (selectedTab) {
      case 0: // Cardmarket
        return order.state?.state;
      case 1: // Cardtrader
        return order.state?.state;
      case 2: // Manapool (Website)
        return order.financial_status; // Assuming financial_status is the order status for Manapool
      case 3: // Manapool
        return order.financial_status;
      default:
        return '';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'shipped':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const renderOrderItems = (order) => {
    switch (selectedTab) {
      case 0: // Cardmarket
        return order.article.map((article, index) => (
          <TableRow key={index}>
            <TableCell>{article.product.enName}</TableCell>
            <TableCell>{article.count}</TableCell>
            <TableCell>{article.price}</TableCell>
          </TableRow>
        ));
      case 1: // Cardtrader
        return order.order_items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.formatted_price}</TableCell>
          </TableRow>
        ));
      default:
        // For other platforms, render line items as before
        return order.line_items?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.price}</TableCell>
          </TableRow>
        ));
    }
  };

  return (
    <>
      <Head>
        <title>Orders & Sales | TCGSync v2</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Orders & Sales</Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Button color="inherit" startIcon={<SvgIcon fontSize="small"><ArrowDownOnSquareIcon /></SvgIcon>}>
                Export Orders
              </Button>
            </Stack>
          </Stack>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
              <Typography variant="h6" align="center">
                {selectedTab !== null ? `Loading ${getPlatformFromIndex(selectedTab)} Orders, Please wait...` : 'Please select a platform'}
              </Typography>
            </div>
          ) : (
            <>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Cardmarket" />
                <Tab label="Cardtrader" />
                <Tab label="Shopify" />
                <Tab label="Manapool" />
              </Tabs>
              <TextField
                label="Filter by Name, Number, Set Code..."
                value={nameNumberFilter}
                onChange={handleNameNumberFilterChange}
                fullWidth
              />
              {renderOrdersTable()}
              <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                  {selectedOrder && (
                    <div>
                      <Typography variant="subtitle1">Order ID: {getOrderID(selectedOrder)}</Typography>
                      <Typography variant="subtitle1">Date: {getOrderDate(selectedOrder)}</Typography>
                      <Typography variant="subtitle1">Total: {getOrderTotal(selectedOrder)}</Typography>
                      <Typography variant="subtitle1">Status: {getOrderStatus(selectedOrder)}</Typography>
                      <Typography variant="h6" style={{ marginTop: '20px' }}>Order Items</Typography>
                      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {renderOrderItems(selectedOrder)}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary" autoFocus>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

            </>
          )}
        </Container>
      </Box>

      <style jsx>{`
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
