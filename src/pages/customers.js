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
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const auth = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [adjustedStoreCredit, setAdjustedStoreCredit] = useState(0);
  const [adjustStoreCreditOpen, setAdjustStoreCreditOpen] = useState(false);

  const openAdjustStoreCredit = () => {
    setAdjustedStoreCredit(selectedCustomer.storeCredit);
    setAdjustStoreCreditOpen(true);
  };

  const closeAdjustStoreCredit = () => {
    setAdjustStoreCreditOpen(false);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://api.tcgsync.com:4000/api/test/shopify_customers', {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        });
        if (response.data.success === 1 && response.data.response === 200) {
          setCustomers(response.data.data.customers);
          setFilteredCustomers(response.data.data.customers);
          setLoading(false);
        } else {
          console.error('Failed to fetch customers:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, [auth.user.accessToken]);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.orders.some(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, customers]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    setOpenDialog(false);
  };

  const handleClickOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setSelectedOrder(null);
    setOpenOrderDialog(false);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      if (property === 'totalOrders') {
        return isAsc
          ? a.orders.length - b.orders.length
          : b.orders.length - a.orders.length;
      } else if (property === 'totalSpend') {
        const totalSpendA = a.orders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0);
        const totalSpendB = b.orders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0);
        return isAsc ? totalSpendA - totalSpendB : totalSpendB - totalSpendA;
      } else if (property === 'storeCredit') {
        return isAsc
          ? a.storeCredit - b.storeCredit
          : b.storeCredit - a.storeCredit;
      } else {
        const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
        const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
    });
    setFilteredCustomers(sortedCustomers);
  };

  const adjustStoreCredit = async (customer, storeCredit) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        return { ...customer, storeCredit: adjustedStoreCredit };
      }
      return customer;
    });
    const response = await axios.get(`https://api.tcgsync.com:4000/api/test/shopify/adjustCredit?customerId=${customer}&newStoreCredit=${storeCredit}`, {
      headers: {
        'X-Access-Token': auth.user.accessToken,
      },
    });
    if (response.data.success === 1 && response.data.response === 200) {
      setLoading(false);
    } else {
      console.error('Failed to fetch customers:', response.data.message);
    }
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);

    handleCloseDialog();
    setAdjustStoreCreditOpen(false);
  };

  const renderNotNull = (value) => (value ? value : "N/A");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredCustomers.length - page * rowsPerPage);

  return (
    <>
      <Head>
        <title>Customers | TCGSync v2</title>
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
              <Grid item xs={12}>
                <TextField
                  label="Search customers"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <a onClick={() => handleSort('firstName')}>First Name</a>
                      </TableCell>
                      <TableCell>
                        <a onClick={() => handleSort('lastName')}>Last Name</a>
                      </TableCell>
                      <TableCell>
                        <a onClick={() => handleSort('email')}>Email</a>
                      </TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>
                        <a onClick={() => handleSort('storeCredit')}>Store Credit</a>
                      </TableCell>
                      <TableCell>
                        <a onClick={() => handleSort('totalOrders')}>Total Orders</a>
                      </TableCell>
                      <TableCell>
                        <a onClick={() => handleSort('totalSpend')}>Total Spend</a>
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(loading || filteredCustomers.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
                        <TableRow key={customer.id} hover onClick={() => handleClickCustomer(customer)}>
                          <TableCell>{renderNotNull(customer.firstName)}</TableCell>
                          <TableCell>{renderNotNull(customer.lastName)}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{`${customer.addresses[0]?.address1}, ${customer.addresses[0]?.city}, ${customer.addresses[0]?.province}, ${customer.addresses[0]?.country}, ${customer.addresses[0]?.zip}`}</TableCell>
                          <TableCell>{customer.storeCredit ? customer.storeCredit : 0}</TableCell>
                          <TableCell>{customer.orders.length}</TableCell>
                          <TableCell>{customer.orders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="outlined" onClick={() => handleClickCustomer(customer)}>View Orders</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={7} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Dialog fullWidth maxWidth="md" open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <Typography variant="h6">Name: {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</Typography>
              <Typography variant="subtitle1">Email: {selectedCustomer.email}</Typography>
              <Typography variant="subtitle1">Address: {`${selectedCustomer.addresses[0]?.address1}, ${selectedCustomer.addresses[0]?.city}, ${selectedCustomer.addresses[0]?.province}, ${selectedCustomer.addresses[0]?.country}, ${selectedCustomer.addresses[0]?.zip}`}</Typography>
              <Typography variant="h6">Orders:</Typography>
              <ul>
                {selectedCustomer.orders.map((order) => (
                  <li key={order.id} onClick={() => handleClickOrder(order)}>{order.name}</li>
                ))}
              </ul>
              <Button variant="contained" onClick={openAdjustStoreCredit}>Adjust Store Credit</Button>
              <Dialog fullWidth maxWidth="md" open={adjustStoreCreditOpen} onClose={closeAdjustStoreCredit}>
                <DialogTitle>Adjust Store Credit</DialogTitle>
                <DialogContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Current Store Credit: {Number(selectedCustomer.storeCredit)}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) + 1)}>+1</Button>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) + 5)}>+5</Button>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) + 10)}>+10</Button>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) - 1)}>-1</Button>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) - 5)}>-5</Button>
                      <Button variant="outlined" onClick={() => setAdjustedStoreCredit(Number(selectedCustomer.storeCredit) - 10)}>-10</Button>
                    </Stack>
                    <TextField
                      label="Custom Amount (-)"
                      variant="outlined"
                      type="number"
                      value={adjustedStoreCredit}
                      onChange={(e) => setAdjustedStoreCredit(Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={() => adjustStoreCredit(selectedCustomer._id, adjustedStoreCredit)}>Adjust Store Credit</Button>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeAdjustStoreCredit}>Cancel</Button>
                </DialogActions>
              </Dialog>


            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth="md" open={openOrderDialog} onClose={handleCloseOrderDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6">Order: {selectedOrder.name}</Typography>
              <Typography variant="subtitle1">Total Price: {selectedOrder.totalPrice}</Typography>
              <Typography variant="subtitle1">Order Items:</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Vendor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.lineItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.vendor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
