import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Card, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Typography, TextField, TablePagination, FormGroup, FormControlLabel, Switch, Box, IconButton } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

export const OrdersTable = ({ salesData, filterText, selectedDate }) => {
  const [sortCriteria, setSortCriteria] = useState('price');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCardmarket, setShowCardmarket] = useState(true);
  const [showCardtrader, setShowCardtrader] = useState(true);
  const [showShopify, setShowShopify] = useState(true);

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = [...salesData].sort((a, b) => {
    if (sortCriteria === 'platform') {
      return sortOrder === 'asc' ? a.platform.localeCompare(b.platform) : b.platform.localeCompare(a.platform);
    } else if (sortCriteria === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }else if (sortCriteria === 'quantity') {
      return sortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    } else if (sortCriteria === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  const filteredData = sortedData.filter(article => {
    const matchesFilterText = article.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesSelectedDate = selectedDate ? article.createdAt.startsWith(selectedDate) : true;
    const isVisible =
      (article.platform === 'Cardmarket' && showCardmarket) ||
      (article.platform === 'Cardtrader' && showCardtrader) ||
      (article.platform === 'Shopify' && showShopify);
    return matchesFilterText && matchesSelectedDate && isVisible;
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
    }
    return null;
  };

  return (
    <Card>
      <Box p={2}>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={showCardmarket} onChange={() => setShowCardmarket(!showCardmarket)} />}
            label="Show Cardmarket"
          />
          <FormControlLabel
            control={<Switch checked={showCardtrader} onChange={() => setShowCardtrader(!showCardtrader)} />}
            label="Show Cardtrader"
          />
          <FormControlLabel
            control={<Switch checked={showShopify} onChange={() => setShowShopify(!showShopify)} />}
            label="Show Shopify"
          />
        </FormGroup>
      </Box>
      <Scrollbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </TableCell>
                <TableCell align="center" onClick={() => handleSort('platform')}>
                  Platform {getSortIcon('platform')}
                </TableCell>
                <TableCell align="center" onClick={() => handleSort('quantity')}>
                  Sold {getSortIcon('quantity')}
                </TableCell>
                <TableCell align="center" onClick={() => handleSort('price')}>
                  Price {getSortIcon('price')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((article, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{article.name}</TableCell>
                  <TableCell align="center">{article.platform}</TableCell>
                  <TableCell align="center">{article.quantity}</TableCell>
                  <TableCell align="center">{article.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Scrollbar>
    </Card>
  );
};

OrdersTable.propTypes = {
  salesData: PropTypes.array.isRequired,
  filterText: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
};

export default OrdersTable;
