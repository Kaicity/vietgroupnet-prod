import { Box } from '@mui/material';
import { Divider as Line } from 'antd';
import theme from '../utils/theme';

const Divider = () => {
  return (
    <Box sx={{ padding: '0px 20px' }}>
      <Line style={{borderColor: theme.gray[100] }} />
    </Box>
  );
};

export default Divider;

