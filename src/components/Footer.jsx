import { Box, Typography } from '@mui/material';
import React from 'react';
import theme from '../utils/theme';
import Divider from '../components/Divider';

const Footer = () => {
  return (
    <Box>
      <Divider />
      <Typography color={theme.gray[400]} textAlign="center" fontWeight="500">
        © 2024, phần mềm quản lý VietGroupNet
      </Typography>
    </Box>
  );
};

export default Footer;
