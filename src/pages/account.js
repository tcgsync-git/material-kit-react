import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, List,Divider,ListItem ,ListItemIcon, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, TextField, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Tab, Table, TableHead, TableRow, TableCell, TableBody   } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { useAuth } from 'src/hooks/use-auth'; // Import useAuth to access user data
import { useEffect, useState } from 'react';
import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const MarketPriceTable = ({ selectedGame, value, handleChange, pricePointType }) => {
  const [selectedTab, setSelectedTab] = useState('condition');

  useEffect(() => {
    setSelectedTab(pricePointType === 'Market Price' ? 'condition' : 'rarity');
  }, [pricePointType]);
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [conditionDiscounts, setConditionDiscounts] = useState({
    NM: 0,
    LP: 0,
    MP: 0,
    HP: 0,
    DMG: 0,
  });

  const [rarityDiscounts, setRarityDiscounts] = useState({
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Mythic: 0,
  });

  const handleDiscountChange = (condition, event) => {
    const discountPercentage = event.target.value;
    setConditionDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [condition]: discountPercentage,
    }));
  };

  const handleRarityDiscountChange = (rarity, event) => {
    const discountPercentage = event.target.value;
    setRarityDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [rarity]: discountPercentage,
    }));
  };

  useEffect(() => {
    setConditionDiscounts({
      NM: 0,
      LP: 0,
      MP: 0,
      HP: 0,
      DMG: 0,
    });
    setRarityDiscounts({
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Mythic: 0,
    });
  }, [value]);

  return (
    <div>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="Condition" value="condition" />
            <Tab label="Rarity" value="rarity" />
          </TabList>
        </Box>
        <TabPanel value="condition">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Condition</TableCell>
                <TableCell>Discount (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(conditionDiscounts).map(([condition, discount]) => (
                <TableRow key={condition}>
                  <TableCell>{condition}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={discount}
                      onChange={(event) => handleDiscountChange(condition, event)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel value="rarity">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rarity</TableCell>
                <TableCell>Discount (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(rarityDiscounts).map(([rarity, discount]) => (
                <TableRow key={rarity}>
                  <TableCell>{rarity}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={discount}
                      onChange={(event) => handleRarityDiscountChange(rarity, event)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
      </TabContext>
    </div>
  );
};
const requiredFields = ['forename', 'surname', 'email', 'ad1', 'ad2', 'town', 'country', 'county', 'postzip', 'contactnumber'];
const integrationsRequiredFields = ['manapoolAccessToken', 'manapoolEmail', 'cardtraderJwtToken', 'shopifyStoreName', 'shopifyAccessToken', 'shopifyStoreName2', 'shopifyAccessToken2', 'shopifyStoreName3', 'shopifyAccessToken3', 'shopifyStoreName4', 'shopifyAccessToken4', 'shopifyStoreName5', 'shopifyAccessToken5', 'shopifyStoreName6', 'shopifyAccessToken6', 'shopifyStoreName7', 'shopifyAccessToken7', 'shopifyStoreName8', 'shopifyAccessToken8'];
const AutomatedPricingModal = ({ open, onClose, taskCompletion, setTaskCompletion, auth }) => {
  const [pricePointType, setPricePointType] = useState('Market Price');
  const [selectedMainOption, setSelectedMainOption] = useState('');
  const [selectedFallbackOption, setSelectedFallbackOption] = useState('');
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedGame, setSelectedGame] = useState("1");
  const [hybridPricing, setHybridPricing] = useState(false);
  const [value, setValue] = useState('1');
  const [gameConfigurations, setGameConfigurations] = useState({ ...auth.user.autopricingConfiguration }); 
  const gameCategoryMap = {
    1: "Magic: The Gathering",
    2: "YuGiOh",
    3: "Pokemon",
    4: "Axis & Allies",
    5: "Boardgames",
    6: "D & D Miniatures",
    7: "Epic",
    8: "Heroclix",
    9: "Monsterpocalypse",
    10: "Redakai",
    11: "Star Wars Miniatures",
    12: "World of Warcraft Miniatures",
    13: "WoW",
    14: "Supplies",
    15: "Organizers and Stores",
    16: "Cardfight Vanguard",
    17: "Force of Will",
    18: "Dice Masters",
    19: "Future Card BuddyFight",
    20: "Weiss Schwarz",
    21: "My Little Pony",
    22: "TCGplayer",
    23: "Dragon Ball Z TCG",
    24: "Final Fantasy TCG",
    25: "UniVersus",
    26: "Star Wars: Destiny",
    27: "Dragon Ball Super CCG",
    28: "Dragoborne",
    29: "Funko",
    30: "MetaX TCG",
    31: "Card Sleeves",
    32: "Deck Boxes",
    33: "Card Storage Tins",
    34: "Life Counters",
    35: "Playmats",
    36: "Zombie World Order TCG",
    37: "The Caster Chronicles",
    38: "My Little Pony CCG",
    39: "Warhammer Books",
    40: "Warhammer Big Box Games",
    41: "Warhammer Box Sets",
    42: "Warhammer Clampacks",
    43: "Citadel Paints",
    44: "Citadel Tools",
    45: "Warhammer Game Accessories",
    46: "Books",
    47: "Exodus TCG",
    48: "Lightseekers TCG",
    49: "Protective Pages",
    50: "Storage Albums",
    51: "Collectible Storage",
    52: "Supply Bundles",
    53: "Munchkin CCG",
    54: "Warhammer Age of Sigmar Champions TCG",
    55: "Architect TCG",
    56: "Bulk Lots",
    57: "Transformers TCG",
    58: "Bakugan TCG",
    59: "KeyForge",
    60: "Chrono Clash System",
    61: "Argent Saga TCG",
    62: "Flesh and Blood TCG",
    63: "Digimon Card Game",
    64: "Alternate Souls",
    65: "Gate Ruler",
    66: "MetaZoo",
    67: "WIXOSS",
    68: "One Piece Card Game",
    69: "Marvel Comics",
    70: "DC Comics",
    71: "Disney Lorcana",
    72: "Battle Spirits Saga",
    73: "Shadowverse",
    74: "Grand Archive TCG",
    75: "Akora TCG",
    76: "Kryptik TCG",
    77: "Sorcery: Contested Realm",
    88: "Video Games",
    78: "Alpha Clash",
    80: "Dragon Ball Super Fusion World",
    79: "Star Wars Unlimited"
  };
  useEffect(() => {
    if (pricePointType === 'Market Price') {
      setAvailableOptions(['marketPrice', 'lowPrice', 'midPrice', 'highPrice', 'directLowPrice']);
    } else {
      setAvailableOptions(['lowPrice', 'lowestShipping', 'lowestListingPrice', 'marketPrice', 'directLowPrice']);
    }
  }, [pricePointType]);

  useEffect(() => {
    if (selectedGame) {
      const gameConfiguration = gameConfigurations[selectedGame] || {};
      setSelectedMainOption(gameConfiguration.mainPricePoint || '');
      setSelectedFallbackOption(gameConfiguration.fallbackPricePoint || '');
      setHybridPricing(gameConfiguration.hybridPricing || false);
    }
  }, [selectedGame, gameConfigurations]);

  const handlePricePointTypeChange = (event) => {
    const newPricePointType = event.target.value;
    setPricePointType(newPricePointType);
    setSelectedMainOption('');
    setSelectedFallbackOption('');
  };

  const handleMainOptionChange = (event) => {
    setSelectedMainOption(event.target.value);
  };

  const handleFallbackOptionChange = (event) => {
    setSelectedFallbackOption(event.target.value);
  };

  const handleGameChange = (event) => {
    const selectedGame = event.target.value;
    setSelectedGame(selectedGame);
  };

  const handleHybridPricingChange = (event) => {
    setHybridPricing(event.target.checked);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveConfiguration = async () => {
    const updatedConfigurations = {
      ...gameConfigurations,
      [selectedGame]: {
        mainPricePoint: selectedMainOption,
        fallbackPricePoint: selectedFallbackOption,
        hybridPricing: hybridPricing,
      },
    };
    setGameConfigurations(updatedConfigurations);

    const updatedUserConfig = {
      ...auth.user.autopricingConfiguration,
      [selectedGame]: {
        mainPricePoint: selectedMainOption,
        fallbackPricePoint: selectedFallbackOption,
        hybridPricing: hybridPricing,
      },
    };

    try {
      const response = await axios.post(
        'https://api.tcgsync.com:4000/api/user/updateprofile',
        { ...auth.user, autopricingConfiguration: updatedUserConfig },
        {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );
      auth.updateUser({ ...auth.user, autopricingConfiguration: updatedUserConfig });
      setTaskCompletion({ ...taskCompletion, configureAutomatedPricing: true });
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Handle error saving configuration
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Configure Automated Pricing</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FormControl style={{ marginRight: '20px', flexBasis: '50%' }}>
            <InputLabel htmlFor="game-select">Select Game</InputLabel>
            <Select
              value={selectedGame}
              onChange={handleGameChange}
              fullWidth
            >
              {Object.entries(gameCategoryMap).map(([gameId, gameName]) => (
                <MenuItem key={gameId} value={gameId}>{gameName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <FormControl component="fieldset" style={{ flexBasis: '50%' }}>
            <FormLabel component="legend">Price Point Type</FormLabel>
            <RadioGroup
              aria-label="price-point-type"
              name="price-point-type"
              value={pricePointType}
              onChange={handlePricePointTypeChange}
              style={{ flexDirection: 'row' }}
            >
              <FormControlLabel value="Market Price" control={<Radio />} label="Market Price" />
              <FormControlLabel value="SKU Price" control={<Radio />} label="SKU Price" />
            </RadioGroup>
            <FormControlLabel
              control={<Checkbox checked={hybridPricing} onChange={handleHybridPricingChange} />}
              label="Hybrid Pricing"
            />
          </FormControl>
          <FormControl component="fieldset" style={{ flexBasis: '50%' }}>
            <FormLabel component="legend">Main Price Point</FormLabel>
            <RadioGroup
              aria-label="main-price-point"
              name="main-price-point"
              value={selectedMainOption}
              onChange={handleMainOptionChange}
            >
              {availableOptions.map((option) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" style={{ flexBasis: '50%' }}>
            <FormLabel component="legend">Fallback Price Point</FormLabel>
            <RadioGroup
              aria-label="fallback-price-point"
              name="fallback-price-point"
              value={selectedFallbackOption}
              onChange={handleFallbackOptionChange}
            >
              {availableOptions
                .filter((option) => option !== selectedMainOption)
                .map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <MarketPriceTable selectedGame={selectedGame} value={value} handleChange={handleChange} pricePointType={pricePointType} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSaveConfiguration} color="primary">Complete</Button>
      </DialogActions>
    </Dialog>
  );
};
const ImportShopifyModal = ({ open, onClose, taskCompletion, setTaskCompletion, auth }) => {
  const [importStarted, setImportStarted] = useState(false); // State to track import status

  useEffect(() => {
    const isImportStarted = localStorage.getItem('productImportStarted');
    if (isImportStarted) {
      setImportStarted(true);
    }
  }, []);
  const handleProductImport = async () => {
    try {
      // Disable the button to prevent multiple clicks
      setImportStarted(true);

      // Add logic to initiate product import
      console.log('Product import initiated');
      localStorage.setItem('productImportStarted', true);
      // Make a POST request to the /fetch-products endpoint
      const response = await fetch('https://tcgs.xyz:8000/fetch-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: auth.user.username
        })
      });

      // Check if the request was successful
      if (response.ok) {
        console.log('Product import process started successfully.');
        // Save the import status to local storage
        localStorage.setItem('productImportStarted', true);
        // Update task completion status
        setTaskCompletion({ ...taskCompletion, importShopify: true });
        onClose();
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.error('Error initiating product import:', errorMessage);
      }
    } catch (error) {
      console.error('Error initiating product import:', error);
    } finally {
      // Re-enable the button after the import process is completed
      setImportStarted(false);
    }
  };


  const handleCustomerImport = async () => {
    try {
      // Add logic to initiate customer import
      console.log('Customer import initiated');
      // You can make an API call here to start customer import process
    } catch (error) {
      console.error('Error initiating customer import:', error);
    }
  };
  const handleComplete = () => {
    // Update task completion status
    setTaskCompletion({ ...taskCompletion, importShopify: true });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import Shopify</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Select what you want to import from Shopify:</Typography>
        {/* Add buttons for triggering product pull and use pull */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button
            variant="outlined"
            onClick={handleProductImport}
            disabled={importStarted} // Disable the button if import is started
            sx={{ backgroundColor: importStarted ? 'gray' : '', color: importStarted ? 'white' : '' }} // Change button color if import is started
          >
            {importStarted ? 'Importing...' : 'Begin Product Import'}
          </Button>
          <Button variant="outlined" onClick={handleCustomerImport}>Begin Customer Import</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleComplete}>Complete</Button>
      </DialogActions>
    </Dialog>
  );
};
const PointOfSaleModal = ({ open, onClose, taskCompletion, setTaskCompletion, auth }) => {
  const [formData, setFormData] = useState(auth.user.posConfig); // Initialize form data with existing configuration

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    // Update the posConfig in the auth.user object
    auth.updateUser({ ...auth.user, posConfig: formData });
    // Mark the task as completed
    setTaskCompletion({ ...taskCompletion, configurePointOfSale: true });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configure Point of Sale</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Update your point of sale settings here:</Typography>
        {Object.entries(formData).map(([key, value]) => (
          <TextField
            key={key}
            name={key}
            label={key}
            value={value}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};


// New modal component for configuring buylist
const BuylistModal = ({ open, onClose, taskCompletion, setTaskCompletion }) => {
  const handleComplete = () => {
    setTaskCompletion({ ...taskCompletion, configureBuylist: true });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configure Buylist</DialogTitle>
      <DialogContent>
        <Typography variant="body1"></Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleComplete}>Complete</Button>
      </DialogActions>
    </Dialog>
  );
};
const TaskProgress = ({ taskCompletion, setTaskCompletion, auth }) => {
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openIntegrationsModal, setOpenIntegrationsModal] = useState(false);
  const [openAutomatedPricingModal, setOpenAutomatedPricingModal] = useState(false);
  const [openImportShopifyModal, setOpenImportShopifyModal] = useState(false);
  const [openPointOfSaleModal, setOpenPointOfSaleModal] = useState(false); // New state for point of sale modal
  const [openBuylistModal, setOpenBuylistModal] = useState(false); // New state for buylist modal

  const handleOpenAccountModal = () => {
    setOpenAccountModal(true);
  };

  const handleOpenIntegrationsModal = () => {
    setOpenIntegrationsModal(true);
  };

  const handleOpenAutomatedPricingModal = () => {
    setOpenAutomatedPricingModal(true);
  };

  const handleOpenImportShopifyModal = () => {
    setOpenImportShopifyModal(true);
  };

  const handleCloseModals = () => {
    setOpenAccountModal(false);
    setOpenIntegrationsModal(false);
    setOpenAutomatedPricingModal(false);
    setOpenImportShopifyModal(false);
    setOpenPointOfSaleModal(false); // Close point of sale modal
    setOpenBuylistModal(false); // Close buylist modal
  };

  const handleTaskConfigure = (task) => {
    if (!taskCompletion[task]) {
      if (task === 'configureAccount') {
        handleOpenAccountModal();
      } else if (task === 'configureIntegrations') {
        handleOpenIntegrationsModal();
      } else if (task === 'configureAutomatedPricing') {
        handleOpenAutomatedPricingModal();
      } else if (task === 'importShopify') {
        handleOpenImportShopifyModal();
      } else if (task === 'configurePointOfSale') { // Open point of sale modal
        setOpenPointOfSaleModal(true);
      } else if (task === 'configureBuylist') { // Open buylist modal
        setOpenBuylistModal(true);
      }
    }
  };

  const handleTaskComplete = (task) => {
    const updatedTaskCompletion = { ...taskCompletion, [task]: !taskCompletion[task] };
    setTaskCompletion(updatedTaskCompletion);
  };

  return (
    <>
      <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center', paddingBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Onboarding Progress
        </Typography>

        <List sx={{ paddingBottom: '1rem' }}>
          <Box sx={{ paddingLeft: '1rem' }}>
            <TaskItem
              label="Configure Account"
              completed={taskCompletion.configureAccount}
              onClick={() => handleTaskConfigure('configureAccount')}
              toggleCompletion={() => handleTaskComplete('configureAccount')}
            />
            <TaskItem
              label="Configure Integrations"
              completed={taskCompletion.configureIntegrations}
              onClick={() => handleTaskConfigure('configureIntegrations')}
              toggleCompletion={() => handleTaskComplete('configureIntegrations')}
            />
            <TaskItem
              label="Configure Point of Sale"
              completed={taskCompletion.configurePointOfSale}
              onClick={() => handleTaskConfigure('configurePointOfSale')}
              toggleCompletion={() => handleTaskComplete('configurePointOfSale')}
            />
            <TaskItem
              label="Import Shopify"
              completed={taskCompletion.importShopify}
              onClick={() => handleTaskConfigure('importShopify')}
              toggleCompletion={() => handleTaskComplete('importShopify')}
            />
          </Box>
          <Divider />

          <Box sx={{ paddingLeft: '1rem', paddingTop: '1rem' }}>
            <Typography variant="subtitle1" gutterBottom>
              Please configure and import Shopify first:
            </Typography>
            <TaskItem
              label="Configure Automated Pricing"
              completed={taskCompletion.configureAutomatedPricing}
              onClick={() => handleTaskConfigure('configureAutomatedPricing')}
              toggleCompletion={() => handleTaskComplete('configureAutomatedPricing')}
            />
            <TaskItem
              label="Configure Buylist"
              completed={taskCompletion.configureBuylist}
              onClick={() => handleTaskConfigure('configureBuylist')}
              toggleCompletion={() => handleTaskComplete('configureBuylist')}
            />
          </Box>
        </List>
      </Box>

      {/* Modals for different tasks */}
      <TaskCompletionModal
        open={openAccountModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        requiredFields={requiredFields}
        auth={auth}
      />
      <TaskCompletionModal
        open={openIntegrationsModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        requiredFields={integrationsRequiredFields}
        auth={auth}
      />
      <AutomatedPricingModal
        open={openAutomatedPricingModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        auth={auth}
      />
      <ImportShopifyModal
        open={openImportShopifyModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        auth={auth}
      />
      <PointOfSaleModal // New modal for point of sale configuration
        open={openPointOfSaleModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        auth={auth}
      />
      <BuylistModal // New modal for buylist configuration
        open={openBuylistModal}
        onClose={handleCloseModals}
        taskCompletion={taskCompletion}
        setTaskCompletion={setTaskCompletion}
        auth={auth}
      />
    </>
  );
};

const TaskItem = ({ label, completed, onClick, toggleCompletion }) => {
  return (
    <ListItem button disablePadding >
      <ListItemIcon onClick={toggleCompletion}>
        {completed ? (
          <CheckCircleOutline sx={{ color: 'success.main', cursor: 'pointer' }} onClick={toggleCompletion} />
        ) : (
          <CancelOutlined sx={{ color: 'error.main', cursor: 'pointer' }} onClick={toggleCompletion} />
        )}
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ variant: 'subtitle1' }} onClick={toggleCompletion} />
      <Button onClick={onClick} variant="contained" size="small">
        Configure
      </Button>
    </ListItem>
  );
};

const TaskCompletionModal = ({ open, onClose, taskCompletion, setTaskCompletion, requiredFields, auth }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const missingFields = requiredFields.filter(field => !taskCompletion[field]);
    const initialFormData = missingFields.reduce((data, field) => ({
      ...data,
      [field]: auth.user ? auth.user[field] || '' : '' // Set existing values if available
    }), {});
    setFormData(initialFormData);
  }, [taskCompletion, requiredFields, auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userDataWithNewFields = { ...auth.user, ...formData };

      const response = await axios.post(
        'https://api.tcgsync.com:4000/api/user/updateprofile',
        userDataWithNewFields,
        {
          headers: {
            'X-Access-Token': auth.user.accessToken,
          },
        }
      );

      auth.updateUser(userDataWithNewFields);

      console.log('User data updated successfully:', response.data);

      onClose();
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Provide Required Information</DialogTitle>
      <DialogContent>
        {Object.entries(formData).map(([field, value]) => (
          <TextField
            key={field}
            name={field}
            label={field}
            value={value}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const Page = () => {
  const auth = useAuth(); // Access user data from useAuth hook
  const [taskCompletion, setTaskCompletion] = useState({
    configureAccount: false,
    configureIntegrations: false,
    configureAutomatedPricing: false,
    importShopify: false,
  });
  return (
    <>
      <Head>
        <title>
          Account | TCGSync v2
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Account
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >

                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <AccountProfileDetails user={auth.user} /> {/* Pass user data to AccountProfileDetails component */}
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TaskProgress taskCompletion={taskCompletion} setTaskCompletion={setTaskCompletion} auth={auth} />
                </Grid>
              </Grid>
            </div>
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
