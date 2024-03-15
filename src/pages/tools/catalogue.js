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
    FormControl,
    Select,
    InputLabel,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Pagination,
    MenuItem,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';
import { Inventory2Outlined, MoneyOffOutlined, ShoppingCartCheckoutOutlined, StorefrontOutlined } from '@mui/icons-material';
import { CSVLink } from 'react-csv';

const Page = () => {
    const auth = useAuth();
    const [games, setGames] = useState([]);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedSet, setSelectedSet] = useState('');
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
    const [bottomNavValue, setBottomNavValue] = useState("catalogue");
    const [csvData, setCSVData] = useState([]);
    const [csvFileName, setCSVFileName] = useState('');

    const handleBottomNavChange = (event, newValue) => {
        setBottomNavValue(newValue);
    };

    const handleGameChange = (event) => {
        const gameId = event.target.value;
        setSelectedGame(gameId);
        setSelectedSet('');
        fetchExpansions(gameId);
    };

    const handleSetChange = (event) => {
        setSelectedSet(event.target.value);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.tcgsync.com:4000/api/test/get/products?game=${selectedGame}&set=${selectedSet}`, {
                headers: {
                    'X-Access-Token': auth.user.accessToken,
                },
            });
            const fetchedProducts = response.data.data;
            setProducts(fetchedProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again later.');
            setLoading(false);
        }
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

    const fetchExpansions = async (categoryId) => {
        try {
            const response = await axios.get('https://api.tcgsync.com:4000/api/test/get/expansions', {
                headers: {
                    'X-Access-Token': auth.user.accessToken,
                },
                params: {
                    game: categoryId,
                    region: auth.user.region,
                },
            });

            if (response.data.success === 1) {
                let expansionsData = response?.data?.data || [];
                expansionsData.sort((a, b) => a.name.localeCompare(b.name));
                setSets(expansionsData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const exportCSV = () => {
        const csvData = products.flatMap(product =>
            product.skus.map(sku => ({
            
                name: product.name,
                rarity: product.rarity,
                setCode: product.abbreviation,
                number: product.number,
                condition: sku.condAbbr,
                language: sku.langAbbr,
                printing: sku.printingName
            }))
        );
    
        console.log("CSV Data:", csvData); // Log CSV data
    
        const csvFileName = 'exported_products.csv';
    
        return (
            <CSVLink
            data={csvData}
            headers={[
            
                { label: 'Name', key: 'name' },
                { label: 'Set Code', key: 'setCode' },
                { label: 'Number', key: 'number' },
                { label: 'Condition', key: 'condition' },
                { label: 'Language', key: 'language' },
                { label: 'Printing', key: 'printing' }
            ]}
            filename={csvFileName}
            style={{ textDecoration: 'none' }} // Ensure that the link is visible and clickable
        >
            {/* Button text or any other clickable element */}
            <Button variant="contained" disabled={!products.length}>Export CSV</Button>
        </CSVLink>
        
        );
    };
    


    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Head>
                <title>Pricing | TCGSync v2</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="game-select-label">Select Game</InputLabel>
                                <Select
                                    labelId="game-select-label"
                                    id="game-select"
                                    value={selectedGame}
                                    onChange={handleGameChange}
                                >
                                    {games.map((game) => (
                                        <MenuItem key={game.categoryId} value={game.categoryId}>{game.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="set-select-label">Select Set</InputLabel>
                                <Select
                                    labelId="set-select-label"
                                    id="set-select"
                                    value={selectedSet}
                                    onChange={handleSetChange}
                                    disabled={!selectedGame}
                                >
                                    {sets.map((set) => (
                                        <MenuItem key={set.groupId} value={set.groupId}>{set.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={fetchProducts} disabled={!selectedGame || !selectedSet}>Fetch Products</Button>
                        </Grid>
                        <Grid item xs={12}>
    {exportCSV()}
</Grid>
                        <Grid item xs={12}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Rarity</TableCell>
                                        <TableCell>Set Code</TableCell>
                                        <TableCell>Number</TableCell>
                                        <TableCell>Condition</TableCell>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Printing</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentProducts.map((product) => (
                                        product.skus.map((sku, index) => (
                                            <TableRow key={`${product.productId}-${sku.skuId}`}>
                                                {index === 0 && (
                                                    <TableCell rowSpan={product.skus.length}>{product.name}</TableCell>
                                                )}
                                                <TableCell>{product.rarity}</TableCell>
                                                <TableCell>{product.abbreviation}</TableCell>
                                                <TableCell>{product.number}</TableCell>
                                                <TableCell>{sku.condAbbr}</TableCell>
                                                <TableCell>{sku.langAbbr}</TableCell>
                                                <TableCell>{sku.printingName}</TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination
                                count={Math.ceil(products.length / productsPerPage)}
                                onChange={(event, value) => paginate(value)}
                            />
                        </Grid>
                    </Grid>
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation
                            showLabels
                            value={bottomNavValue}
                            onChange={handleBottomNavChange}
                        >
                            <BottomNavigationAction label="Catalogue" value="catalogue" component={NextLink} href='/tools/catalogue' icon={<Inventory2Outlined />} />
                            <BottomNavigationAction label="Pricing" value="pricing" component={NextLink} href='/tools/pricing' icon={<MoneyOffOutlined />} />
                            <BottomNavigationAction label="Buylist" value="buylist" component={NextLink} href='/pricing/configs/platform' icon={<ShoppingCartCheckoutOutlined />} />
                            <BottomNavigationAction label="Marketplace" value="marketplace" component={NextLink} href='/pricing/configs/platform' icon={<StorefrontOutlined />} />
                        </BottomNavigation>
                    </Paper>
                </Container>
            </Box>
            {/* CSVLink component for exporting */}

        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
