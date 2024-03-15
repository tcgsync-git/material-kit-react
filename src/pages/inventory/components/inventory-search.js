import React, { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Typography,
  Checkbox
} from '@mui/material';

export const InventorySearch = ({
  setSearchQuery,
  searchQuery,
  selectedVendor,
  selectedProductTypes,
  handleVendorChange,
  handleProductTypeChange,
  sortingCriteria,
  handleSortingChange,
  filterOptions
}) => {
  const [isLoadingExpansions, setIsLoadingExpansions] = useState(false);
  return (
    <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <OutlinedInput
        fullWidth
        placeholder="Search Inventory"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ maxWidth: 500 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton color="primary" aria-label="Search">
              {isLoadingExpansions ? (
                <CircularProgress size={24} />
              ) : (
                <SvgIcon color="action" fontSize="small" component={MagnifyingGlassIcon} />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
      <Select
        value={selectedVendor}
        onChange={(e) => handleVendorChange(e.target.value)}
        variant="outlined"
        sx={{ marginLeft: '1rem', minWidth: '200px' }}
      >
        <MenuItem value="default">Select Vendor</MenuItem>
        {filterOptions.vendors && filterOptions.vendors.map((vendor) => (
          <MenuItem key={vendor} value={vendor}>
            {vendor}
          </MenuItem>
        ))}
      </Select>

      {selectedVendor !== 'default' && (
        <Select
          value={selectedProductTypes}
          onChange={(e) => handleProductTypeChange(e.target.value)}
          variant="outlined"
          sx={{ marginLeft: '1rem', minWidth: '200px' }}
          disabled={isLoadingExpansions}
        >
          <MenuItem value="" disabled>Select Product Type</MenuItem>
          {filterOptions.vendorProductTypes?.[selectedVendor]?.map((productType) => (
            <MenuItem key={productType} value={productType}>
              {productType}
            </MenuItem>
          ))}
        </Select>
      )}

      <Select
        value={sortingCriteria}
        onChange={(e) => handleSortingChange(e.target.value)}
        variant="outlined"
        sx={{ marginLeft: '1rem', minWidth: '200px' }}
      >
        <MenuItem value="name-a-z">Sort by Name (A-Z)</MenuItem>
        <MenuItem value="name-z-a">Sort by Name (Z-A)</MenuItem>
        <MenuItem value="rarity">Sort by Rarity</MenuItem>
        <MenuItem value="price">Sort by Price</MenuItem>
      </Select>

      {/* Show Foil Only toggle */}
      {/* <Checkbox
        onChange={handleShowFoilOnlyChange}
        sx={{ marginLeft: '1rem' }}
      />
      <Typography variant="body2">Show Foil Only</Typography> */}
    </Card>
  );
};
