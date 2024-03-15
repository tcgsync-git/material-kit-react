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
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const auth = useAuth();


  return (
    <>
      <Head>
        <title>Syncing | TCGSync v2</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
