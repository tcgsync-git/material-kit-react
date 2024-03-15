import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Grid,
  Typography,
  CircularProgress,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { InventorySearch } from 'src/sections/inventory/inventory-search'; // Import InventorySearch component
import { InventoryCard } from 'src/sections/inventory/inventory-card';
import { useAuth } from 'src/hooks/use-auth';
import { AddBoxOutlined, AddBoxSharp, FavoriteOutlined, InboxRounded, LocationOnOutlined, PageviewOutlined, PageviewSharp, PhoneBluetoothSpeakerOutlined, RestoreOutlined, SyncAltOutlined, SyncAltSharp } from '@mui/icons-material';
import NextLink from 'next/link';

const Page = () => {
  const auth = useAuth()
  const [bottomNavValue, setBottomNavValue] = useState("addinventory"); // State to manage bottom navigation value
  const [loader, setLoader] = useState(true); // Initially set to true for loading state
  const [allInventory, setAllInventory] = useState([]);
  const [selectedGame, setSelectedGame] = useState("1");
  const [selectedExpansions, setSelectedExpansions] = useState([""]);
  const [sortingCriteria, setSortingCriteria] = useState('name-a-z'); // Default sorting criteria
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [sets, setSets] = useState([]);
  const itemsPerPage = 12;


  useEffect(() => {
    fetchGames();
    fetchExpansions(selectedGame);
  }, []);


  const fetchGames = async () => {
    try {
      const response = await axios.get(
        `https://api.tcgsync.com:4000/api/games/by/fbt`,
        {
          params: {
            username: auth.user.username,
            region: auth.user.region,
            fbt: "yes",
          },
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );

      if (response.data.success === 1) {
        let gamesData = response?.data?.data || [];
        gamesData.sort((a, b) => a.name.localeCompare(b.name)); // Sort games alphabetically
        setGames(gamesData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpansions = async (gameId) => {
    try {
      const response = await axios.get(
        `https://api.tcgsync.com:4000/api/games/expansions/by/fbt`,
        {
          params: {
            username: auth.user.username,
            region: auth.user.region,
            idGame: gameId,
            fbt: "yes",
          },
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );

      if (response.data.success === 1) {
        let expansionsData = response?.data?.data || [];
        expansionsData.sort((a, b) => a.enName.localeCompare(b.enName)); // Sort expansions alphabetically
        setSets(expansionsData);
      }
    } catch (error) {
      console.error(error);
    }
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
                <Typography>Add To</Typography>
              </Stack>
            </Stack>
          
   
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
          </Stack>
        </Container>
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
