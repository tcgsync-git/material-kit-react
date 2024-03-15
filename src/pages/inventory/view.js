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
  Pagination,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { InventorySearch } from '../inventory/components/inventory-search';
import { InventoryCard } from '../inventory/components/inventory-card';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';
import { AddBoxOutlined, PageviewOutlined, SyncAltOutlined } from '@mui/icons-material';

const Page = () => {
  const auth = useAuth();
  const [loader, setLoader] = useState(true);
  const [allInventory, setAllInventory] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(""); // Renamed from selectedGame
  const [selectedProductTypes, setSelectedProductTypes] = useState([""]); // Renamed from selectedExpansions
  const [sortingCriteria, setSortingCriteria] = useState('name-a-z');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({});
  const itemsPerPage = 12;
  const [bottomNavValue, setBottomNavValue] = useState("viewinventory");

  useEffect(() => {
    fetchFilterOptions();
    getUserInventory(currentPage, selectedVendor, selectedProductTypes, sortingCriteria);
  }, []);

  const fetchFilterOptions = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `https://api.tcgsync.com:4000/api/shopify/filters`,
        {
          params: {
            username: auth.user.username,
          },
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );

      if (response.status === 200) {
        const filterOptionsData = response?.data?.filterOptions?.filters || {};
        setFilterOptions(filterOptionsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getUserInventory = async (page, vendor, productTypes, criteria, foilOnly) => {
    setLoader(true);
    try {
      const response = await axios.post(
        'https://api.tcgsync.com:4000/api/shopify/inventory',
        {
          params: {page: page,
            limit: itemsPerPage,
            sortField: criteria.split('-')[0],
            sortOrder: criteria.split('-')[1],
            name: searchQuery,
            productVendor: vendor || undefined,
            productType: productTypes ? productTypes : "",}
        },
        {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );

      if (response.status === 200) {
        const inventoryData = response?.data?.inventory || [];
        console.log(inventoryData)
        setAllInventory(inventoryData);
        const totalPages = response?.data?.pages || 0;
        setTotalPages(totalPages);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const handleSortingChange = (criteria) => {
    setSortingCriteria(criteria);
    getUserInventory(currentPage, selectedVendor, selectedProductTypes, criteria);
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedProductTypes([]);
    setSelectedVendor(selectedOption);
    getUserInventory(currentPage, selectedOption, [], sortingCriteria);
  };

  const handleProductTypeChange = (selectedOptions) => {
    setSelectedProductTypes(selectedOptions);
    getUserInventory(currentPage, selectedVendor, selectedOptions, sortingCriteria);
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getUserInventory(pageNumber, selectedVendor, selectedProductTypes, sortingCriteria);
  };




  const handleSearch = (query, showFoil) => {
    setSearchQuery(query);
    getUserInventory(1, selectedVendor, selectedProductTypes, sortingCriteria, showFoil);
  };

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Inventory | TCGSync v2</title>
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
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Inventory</Typography>
              </Stack>
            </Stack>
            {filterOptions && (
              <InventorySearch
                onSearch={handleSearch}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                selectedProductTypes={selectedProductTypes} // Changed from selectedExpansions to selectedProductTypes
                selectedVendor={selectedVendor} // Changed from selectedGame to selectedVendor
                handleVendorChange={handleVendorChange} // Changed from handleGameChange to handleVendorChange
                handleProductTypeChange={handleProductTypeChange} // Changed from handleSetChange to handleProductTypeChange
                vendors={filterOptions.vendors || []}
                vendorProductTypes={filterOptions.vendorProductTypes?.[selectedVendor] || []} // Changed from game to vendor
                sortingCriteria={sortingCriteria}
                handleSortingChange={handleSortingChange}
                filterOptions={filterOptions} // Pass filterOptions to InventorySearch
              />
            )}

            {loader ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {allInventory.map((inventoryItem) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={inventoryItem.id}>
                    <InventoryCard inventoryItem={inventoryItem} loading={loader} />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                size="small"
                onChange={(_, page) => onPageChange(page)}
              />
            </Box>
          </Stack>
        </Container>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                showLabels
                value={bottomNavValue}
                onChange={handleBottomNavChange}
              >
                <BottomNavigationAction label="View Inventory"  value="viewinventory" component={NextLink} href='/inventory/view' icon={<PageviewOutlined />} />
                <BottomNavigationAction label="Add To Inventory" value="addinventory"  component={NextLink} href='/inventory/add' icon={<AddBoxOutlined />} />
                <BottomNavigationAction label="Bulk Update" component={NextLink} href='/inventory/bulk' icon={<SyncAltOutlined />} />
              </BottomNavigation>
            </Paper>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
