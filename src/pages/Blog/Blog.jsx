// src/UserGuide.js
import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/Header';
import Latest from '../../components/Latest';
import MainContent from '../../components/MainContent';

const steps = [
  { label: 'Đăng nhập vào hệ thống', link: '/guide/login' },
  { label: 'Điều hướng qua các tính năng', link: '/guide/navigation' },
  { label: 'Sử dụng bảng điều khiển', link: '/guide/dashboard' },
  { label: 'Xuất báo cáo và dữ liệu', link: '/guide/reports' },
];

const Blog = () => {
  return (
    <Box m="20px">
      <Box mb={5}>
        <Header
          title="Việt Group Blog"
          subtitle=" Các khóa học cho những người trẻ, trước ngưỡng cửa vào đời."
        />
      </Box>
      <Box>
        <MainContent />
        <Box mb={5} />
        <Latest />
      </Box>
    </Box>
  );
};

export default Blog;
