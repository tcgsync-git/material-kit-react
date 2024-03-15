import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Grid,
  Pagination,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const auth = useAuth();


  return (
    <>
      <Head>
        <title>Ebay | TCGSync v2</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Ebay</Typography>
              </Stack>
            </Stack>
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
