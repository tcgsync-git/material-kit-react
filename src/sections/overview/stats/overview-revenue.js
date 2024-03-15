import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewRevenue = (props) => {
  const { sx, value } = props;

  return (
    <Card sx={sx}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
      <SvgIcon sx={{ color: 'primary.main', fontSize: 56 }}>
          <CurrencyDollarIcon />
        </SvgIcon>
        <div>
          <Typography color="text.secondary" variant="overline">
            Total Revenue
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </div>
        
      </Stack>
    </CardContent>
  </Card>
  );
};

OverviewRevenue.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
