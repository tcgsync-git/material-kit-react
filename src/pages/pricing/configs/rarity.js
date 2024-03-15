import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Grid,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import { AddBoxOutlined, DragIndicatorOutlined, PageviewOutlined, PermDataSettingOutlined, SyncAltOutlined } from '@mui/icons-material';
import NextLink from 'next/link';

const Page = () => {
  const auth = useAuth();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [rarityRules, setRarityRules] = useState({});
  const [pricingSettings, setPricingSettings] = useState(auth.user.rarityRules);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bottomNavValue, setBottomNavValue] = useState("rarityconfig");

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.tcgsync.com:4000/api/test/get/games', {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        });
        setGames(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Error fetching games. Please try again later.');
        setLoading(false);
      }
    };
    fetchGames();
  }, [auth.user.accessToken]);

  useEffect(() => {
    if (selectedGame) {
      const fetchRarityRules = async () => {
        setLoading(true);
        try {
          const existingRarityRules = auth.user.rarityRules[selectedGame.categoryId.toString()];
          if (existingRarityRules) {
            setRarityRules(existingRarityRules);
          } else {
            const defaultValues = {};
            selectedGame.uniqueRarities.forEach(rarity => {
              if (
                auth.user.rarityRules[selectedGame.categoryId.toString()] &&
                auth.user.rarityRules[selectedGame.categoryId.toString()][rarity] !== undefined &&
                auth.user.rarityRules[selectedGame.categoryId.toString()][rarity] !== ""
              ) {
                defaultValues[rarity] = auth.user.rarityRules[selectedGame.categoryId.toString()][rarity];
              } else {
                defaultValues[rarity] = '';
              }
            });
            setRarityRules({ [selectedGame.categoryId]: defaultValues });
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching rarity rules:', error);
          setError('Error fetching rarity rules. Please try again later.');
          setLoading(false);
        }
      };
      fetchRarityRules();
    }
  }, [selectedGame, auth.user.accessToken, auth.user.rarityRules]);

  const handleGameChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedGame = games.find((game) => game.categoryId === selectedCategoryId);
    setSelectedGame(selectedGame);
  };

  const handleValueChange = (rarity, value) => {
    setPricingSettings((prevSettings) => ({
      ...prevSettings,
      [selectedGame.categoryId]: {
        ...prevSettings[selectedGame.categoryId],
        [rarity]: value,
      },
    }));
  };

  const savePricingSettings = () => {
    setLoading(true);
    axios
      .post('/api/pricing/settings', pricingSettings, {
        headers: {
          'X-Access-Token': auth.user.accessToken,
        },
      })
      .then((response) => {
        console.log('Pricing settings saved successfully');
        // Optionally, provide feedback to the user that settings were saved
      })
      .catch((error) => {
        console.error('Error saving pricing settings:', error);
        setError('Error saving pricing settings. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Pricing | TCGSync v2</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <FormControl fullWidth>
            <InputLabel id="game-select-label">Select Game</InputLabel>
            <Select
              labelId="game-select-label"
              id="game-select"
              value={selectedGame ? selectedGame.categoryId : ''}
              onChange={handleGameChange}
            >
              {games.map((game) => (
                <MenuItem key={game.categoryId} value={game.categoryId}>
                  {game.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading && (
            <Box mt={3} textAlign="center">
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography mt={3} color="error" align="center">
              {error}
            </Typography>
          )}
          {selectedGame && (
            <Grid container spacing={1} mt={1} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Box mt={3} textAlign="center">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rarity</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedGame.uniqueRarities.map((rarity) => (
                        <TableRow key={rarity}>
                          <TableCell>{rarity === "" ? "No Rarity" : rarity}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={pricingSettings[selectedGame.categoryId]?.[rarity] || ''}
                              onChange={(event) => handleValueChange(rarity, event.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={savePricingSettings}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Settings'}
            </Button>
          </Box>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={bottomNavValue}
              onChange={handleBottomNavChange}
            >
              <BottomNavigationAction label="Overview" value="overview" component={NextLink} href='/pricing/overview' icon={<PageviewOutlined />} />
              <BottomNavigationAction label="Rarity Config" value="rarityconfig" component={NextLink} href='/pricing/configs/rarity' icon={<DragIndicatorOutlined />} />
              <BottomNavigationAction label="Platform Config" value="platformconfig" component={NextLink} href='/pricing/configs/platform' icon={<PermDataSettingOutlined />} />
            </BottomNavigation>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
