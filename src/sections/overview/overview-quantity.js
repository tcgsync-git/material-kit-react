import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/ListBulletIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { totalmem } from 'os';

export const OverviewQuantity = (props) => {
  const { sx, value, totalUniqueItems } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
          <div>
            <Typography color="text.secondary" variant="overline">
              Total Listings
            </Typography>
            <Typography variant="h4">{value}</Typography>
 
          </div>
          <SvgIcon sx={{ color: 'error.main', fontSize: 56 }}>
            <CurrencyDollarIcon />
          </SvgIcon>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewQuantity.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
