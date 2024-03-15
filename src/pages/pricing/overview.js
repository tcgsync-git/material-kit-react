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
    BottomNavigation,
    BottomNavigationAction,
    Paper,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';
import { AddBoxOutlined, DragIndicatorOutlined, PageviewOutlined, PermDataSettingOutlined, SyncAltOutlined } from '@mui/icons-material';

const Page = () => {
    const auth = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bottomNavValue, setBottomNavValue] = useState("overview");

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

    return (
        <>
            <Head>
                <title>Pricing | TCGSync v2</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
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
