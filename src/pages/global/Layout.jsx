import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '90%',
        overflowY: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
