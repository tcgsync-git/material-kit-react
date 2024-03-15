import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  SvgIcon,
  Badge,
  Drawer,
} from '@mui/material';
import ClockIcon from '@mui/icons-material/AccessTime';
import { Chip } from '@mui/material';

export const InventoryCard = ({ inventoryItem, loading }) => {
  const [showMore, setShowMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const sortVariants = (variants) => {
    const order = ['NM', 'LP', 'MP', 'HP', 'DMG', 'N', 'DM'];
    return variants.sort((a, b) => {
      const aIndex = order.findIndex((keyword) => a.title.includes(keyword));
      const bIndex = order.findIndex((keyword) => b.title.includes(keyword));
      return aIndex - bIndex;
    });
  };

  const renderAllVariants = () => {
    return inventoryItem.variants.map((variant) => (
      <div key={variant.id}>
        <Typography>{variant.title}</Typography>
        <Typography>Price: ${variant.price}</Typography>
        <Typography>Inventory Quantity: {variant.inventoryQuantity}</Typography>
      </div>
    ));
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleProductClick = () => {
    setSelectedItem(inventoryItem);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const timeAgo = (updatedAt) => {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    const timeDifference = currentDate - updatedDate;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));

    return hours > 0 ? `${hours} hours ago` : 'just now';
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #ccc', borderRadius: '8px' }}>
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          <Badge badgeContent={inventoryItem.variants.reduce((acc, curr) => acc + curr.inventoryQuantity, 0)} color="secondary">
            <img
              src={inventoryItem.image}
              alt={inventoryItem.title}
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', cursor: 'pointer' }}
              onClick={handleProductClick}
            />
          </Badge>
          <Typography align="center" variant="h6" style={{ cursor: 'pointer' }} onClick={handleProductClick}>
            {inventoryItem.title}
          </Typography>
          <Typography align="center" variant="subtitle2" color="textSecondary">
            {inventoryItem.productType}
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Typography variant="subtitle2">Variants:</Typography>
          <Stack spacing={1} sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {inventoryItem.variants.map((variant) => (
              <Chip
                key={variant.id}
                label={`${variant.inventoryQuantity} x ${variant.title} - $${variant.price} `}
                color="primary"
                variant="outlined"
                onClick={() => handleItemClick(variant)}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SvgIcon color="action" fontSize="small" component={ClockIcon} />
          <Typography color="text.secondary" variant="body2">
            Updated {timeAgo(inventoryItem.updatedAt)}
          </Typography>
        </Stack>
      </Stack>

      {/* Drawer for displaying detailed information */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: '300px', padding: '20px' }}>
          {selectedItem && (
            <div>
              <Typography variant="h5">{selectedItem.title}</Typography>
              {/* Display description as HTML */}
              <div dangerouslySetInnerHTML={{ __html: selectedItem.descriptionHtml }} />
              <Typography>Product Type: {selectedItem.productType}</Typography>
              <Typography>Vendor: {selectedItem.vendor}</Typography>
              {/* Add more fields here */}
            </div>
          )}



          <Divider sx={{ my: 2 }} />
      
        </div>
      </Drawer>
    </Card>
  );
};

InventoryCard.propTypes = {
  inventoryItem: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
