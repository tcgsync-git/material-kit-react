import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import ShoppingCartIcon from '@heroicons/react/24/outline/ShoppingCartIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewSale = (props) => {
  const { sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
          <SvgIcon sx={{ color: 'error.main', fontSize: 56 }}>
            <ShoppingCartIcon />
          </SvgIcon>
          <div>
            <Typography color="text.secondary" variant="overline">
              Total Sales
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewSale.propTypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
