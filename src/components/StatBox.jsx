import { Box, Icon, Typography } from '@mui/material';
import typography from '../utils/typography';
import theme from '../utils/theme';

const StatBox = ({ title, subtitle, stock, increase, src }) => {
  const stockData = [
    { date: '2024-01-01', price: 100 },
    { date: '2024-01-02', price: 102 },
    { date: '2024-01-03', price: 98 },
    { date: '2024-01-04', price: 101 },
    { date: '2024-01-05', price: 104 },
    // Thêm nhiều dữ liệu hơn
  ];

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography
            fontSize={typography.fontSize.sizeM}
            fontWeight="bold"
            sx={{ color: theme.gray[400] }}
          >
            {subtitle}
          </Typography>
          <Typography
            fontSize={typography.fontSize.sizeXL}
            sx={{ color: theme.gray[700] }}
            fontWeight="bold"
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <img
            src={src}
            alt=""
            style={{
              width: 45,
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography
          fontSize={typography.fontSize.sizeS}
          sx={{ color: theme.greenAccent[100] }}
          fontWeight="bold"
        >
          <Icon sx={{ p: '5px 0px' }}>{stock}</Icon>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
