import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/BanknotesIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewQuantityListed = (props) => {
  const { sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <div>
            <Typography color="text.secondary" variant="overline">
              Total Quantity Listed
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </div>
          <SvgIcon sx={{ color: 'primary.main', fontSize: 56 }}>
          <CurrencyDollarIcon />
        </SvgIcon>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewQuantityListed.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
