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
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NextLink from 'next/link';
import { EmailOutlined, PageviewOutlined, PriceChangeOutlined, SettingsCellOutlined, StyleOutlined } from '@mui/icons-material';

const Page = () => {
  const auth = useAuth();
  const [buylistStats, setBuylistStats] = useState(null);
  const [buylistOrders, setBuylistOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [denialMessage, setDenialMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('orderId'); // Default sort by orderId
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order ascending
  const [filterStatus, setFilterStatus] = useState(''); // Default no filter
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [bottomNavValue, setBottomNavValue] = useState("vieworders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          axios.get('https://api.tcgsync.com:4000/api/buylist/stats', {
            headers: {
              'X-Access-Token': auth.user.accessToken,
            },
          }),
          axios.get('https://api.tcgsync.com:4000/api/buylist/store/get/orders', {
            headers: {
              'X-Access-Token': auth.user.accessToken,
            },
          }),
        ]);

        if (statsResponse.status === 200 && ordersResponse.status === 200) {
          const ordersData = ordersResponse.data;

          // Set buylist orders
          const ordersWithHistory = ordersData.orders.map((order) => ({
            ...order,
            history: [],
          }));

          const customerCounts = {};
          ordersWithHistory.forEach((order) => {
            const name = order.customerDetails.name.toLowerCase();
            customerCounts[name] = (customerCounts[name] || 0) + 1;
          });

          const ordersWithCounts = ordersWithHistory.map((order) => ({
            ...order,
            customerCount: customerCounts[order.customerDetails.name.toLowerCase()] || 0,
          }));

          setBuylistOrders(ordersWithCounts);

          // Calculate statistics
          const totalOrders = ordersWithCounts.length;
          const totalPending = ordersWithCounts.filter(order => order.status === 'Pending').length;
          const totalApproved = ordersWithCounts.filter(order => order.status === 'Approved').length;
          const totalDenied = ordersWithCounts.filter(order => order.status === 'Denied').length;

          // Set calculated statistics
          setBuylistStats({
            totalOrders,
            totalPending,
            totalApproved,
            totalDenied,
          });
        } else {
          console.error('Failed to fetch buylist data');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false); // Set loading to false after fetching orders
    };

    fetchOrders();
  }, [auth.user.accessToken]);

  const handleApprove = async () => {
    try {
      if (!approvalMessage) {
        console.error('Please provide a message for approval');
        return;
      }

      const response = await axios.post(`https://api.tcgsync.com:4000/api/buylist/order/approve`, {
        orderId: selectedOrder.orderId,
        message: approvalMessage,
      }, {
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      });

      if (response.status === 200) {
        // Update order status locally
        const updatedOrders = buylistOrders.map(order => {
          if (order.orderId === selectedOrder.orderId) {
            return { ...order, status: 'Approved' };
          }
          return order;
        });
        setBuylistOrders(updatedOrders);
      } else {
        console.error('Failed to approve order:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving order:', error);
    }
    handleCloseDialog();
  };

  const handleDeny = async () => {
    try {
      if (!denialMessage) {
        console.error('Please provide a reason for denial');
        return;
      }

      const response = await axios.post(`https://api.tcgsync.com:4000/api/buylist/order/deny`, {
        orderId: selectedOrder.orderId,
        message: denialMessage,
      }, {
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      });

      if (response.status === 200) {
        // Update order status locally
        const updatedOrders = buylistOrders.map(order => {
          if (order.orderId === selectedOrder.orderId) {
            return { ...order, status: 'Denied' };
          }
          return order;
        });
        setBuylistOrders(updatedOrders);
      } else {
        console.error('Failed to deny order:', response.statusText);
      }
    } catch (error) {
      console.error('Error denying order:', error);
    }
    handleCloseDialog();
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setDialogOpen(false);
    setApprovalMessage('');
    setDenialMessage('');
  };

  const handleSort = (property) => {
    const newSortOrder = sortBy === property && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(property);
    setSortOrder(newSortOrder);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const BuylistStatsPanel = ({ title, value }) => (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        p: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );

  let filteredOrders = [...buylistOrders];
  if (filterStatus) {
    filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
  }
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(order => {
      return (
        order.orderId.toLowerCase().includes(query) ||
        order.customerDetails.name.toLowerCase().includes(query) ||
        order.customerDetails.email.toLowerCase().includes(query)
      );
    });
  }
  filteredOrders.sort((a, b) => {
    const isAsc = sortOrder === 'asc';
    if (a[sortBy] < b[sortBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  const TableHeadCell = ({ property, label }) => (
    <TableCell
      onClick={() => handleSort(property)}
      sx={{ cursor: 'pointer' }}
    >
      {label}
      {sortBy === property && (
        <Box component="span" sx={{ ml: 1 }}>
          {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </Box>
      )}
    </TableCell>
  );

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  
  return (
    <>
      <Head>
        <title>Buylist | TCGSync v2</title>
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
            <Grid container spacing={3}>
              {/* Buylist Stats Panels */}
              <Grid item xs={12} sm={6} md={3}>
                <BuylistStatsPanel title="Total Orders" value={buylistStats ? buylistStats.totalOrders : 0} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BuylistStatsPanel title="Total Pending" value={buylistStats ? buylistStats.totalPending : 0} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BuylistStatsPanel title="Total Approved" value={buylistStats ? buylistStats.totalApproved : 0} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BuylistStatsPanel title="Total Denied" value={buylistStats ? buylistStats.totalDenied : 0} />
              </Grid>
              {/* Buylist Orders Table */}
              <Grid item xs={12}>
                <Box sx={{ overflowX: 'auto' }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="filter-status-label">Filter by Status</InputLabel>
                    <Select
                      labelId="filter-status-label"
                      id="filter-status"
                      value={filterStatus}
                      onChange={handleFilterStatusChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Denied">Denied</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeadCell property="orderId" label="Order ID" />
                        <TableHeadCell property="customerDetails.name" label="Customer Name" />
                        <TableHeadCell property="customerDetails.email" label="Email" />
                        <TableHeadCell property="customerDetails.phone" label="Phone" />
                        <TableHeadCell property="status" label="Status" />
                        <TableHeadCell property="total" label="Total" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order._id} onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                          <TableCell>{order.orderId}</TableCell>
                          <TableCell>{order.customerDetails.name}</TableCell>
                          <TableCell>{order.customerDetails.email}</TableCell>
                          <TableCell>{order.customerDetails.phone}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Container>
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
            <BottomNavigationAction label="Appearance Config" value="appearanceconfig" component={NextLink} href='/buylist/configs/appearance' icon={<StyleOutlined />} />
          </BottomNavigation>
        </Paper>
      </Box>
      {/* Order Details Dialog */}
      <Dialog fullScreen open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Printing</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.cartItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.selectedCondition}</TableCell>
                      <TableCell>{item.selectedType}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity * item.price}</TableCell> {/* Calculate total */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="h6">Customer Details</Typography>
                <Typography>Name: {selectedOrder.customerDetails.name}</Typography>
                <Typography>Email: {selectedOrder.customerDetails.email}</Typography>
                <Typography>Phone: {selectedOrder.customerDetails.phone}</Typography>
                {/* Display additional customer details if needed */}
              </Box>
              <Box mt={2}>
                <Typography variant="h6">Order Total</Typography>
                <Typography>{selectedOrder.total}</Typography>
              </Box>
              {selectedOrder.status === 'Pending' && (
                <Box mt={2}>
                  <TextField
                    label="Message for approval"
                    variant="outlined"
                    value={approvalMessage}
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <TextField
                    label="Reason for denial"
                    variant="outlined"
                    value={denialMessage}
                    onChange={(e) => setDenialMessage(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Box>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {selectedOrder && selectedOrder.status === 'Pending' && (
            <>
              <Button onClick={handleApprove}>Approve</Button>
              <Button onClick={handleDeny}>Deny</Button>
            </>
          )}
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
