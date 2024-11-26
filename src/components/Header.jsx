import { Box, Typography } from '@mui/material';
import typography from '../utils/typography.js';
import theme from '../utils/theme.js';

// eslint-disable-next-line react/prop-types
const Header = ({ title, subtitle }) => {
  return (
    <Box>
      <Typography
        fontSize={typography.fontSize.variant.h6.size}
        color={theme.gray[700]}
        fontWeight="bold"
        sx={{ mb: '5px' }}
      >
        {title}
      </Typography>
      <Typography fontSize={typography.fontSize.sizeS} color={theme.gray[700]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
