import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../../utils/theme';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Trang bạn truy cập không tồn tại !
      </Typography>
      <Button
        variant="outlined"
        sx={{ color: theme.primary[500] }}
        onClick={handleBackToHome}
      >
        Quay lại Trang chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
