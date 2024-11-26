import React from 'react';
import { DatePicker, Space } from 'antd';
import { useTheme, useMediaQuery } from '@mui/material';

const { RangePicker } = DatePicker;

const StarEndCalender = ({ dateFilter, onChange }) => {
  const theme = useTheme();

  // Define responsive width using MUI breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  // Set the width based on screen size
  const width = isXs
    ? '20vw'   // Extra-small screens
    : isSm
    ? '70vw'   // Small screens
    : isMd
    ? '80vw'   // Medium screens
    : isLg
    ? '15vw'   // Large screens
    : '100%'; // Default for extra-large screens

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <RangePicker
        style={{
          width: width,         // Dynamic width based on screen size
          maxWidth: '100%',     // Ensures it doesn't exceed container width
          height: '40px',
          marginTop: '2px',
        }}
        value={dateFilter}          // Controlled date range
        onChange={onChange}         // External onChange handler
        format="YYYY-MM-DD"         // Date display format
      />
    </Space>
  );
};

export default StarEndCalender;
