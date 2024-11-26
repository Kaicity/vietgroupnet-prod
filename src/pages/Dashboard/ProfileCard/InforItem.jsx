import { Grid2, Typography, Tooltip } from '@mui/material';
import theme from '../../../utils/theme';

const InfoItem = ({ icon: IconComponent = () => null, label, value }) => {
  const isXs = window.innerWidth < 600;

  const textContent = `${label} ${value}`;
  const words = textContent.split(' ');
  const isLongText = words.length > 15;

  return (
    <Grid2
      container
      alignItems="center"
      spacing={1}
      style={{ marginBottom: '12px' }}
    >
      <Grid2 item style={{ flex: '0 0 24px' }}>
        {IconComponent && (
          <IconComponent style={{ fontSize: isXs ? '18px' : '25px' }} />
        )}
      </Grid2>
      <Grid2 item xs>
        <Tooltip title={isLongText ? textContent : ''} arrow>
          <Typography
            sx={{
              fontSize: isXs ? '14px' : '16px',
              wordBreak: 'break-word',
              whiteSpace: isLongText ? 'nowrap' : 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            <span style={{ color: theme.black[900], fontWeight: '500' }}>
              {label}
            </span>{' '}
            <span style={{ color: theme.gray[500], fontWeight: '500' }}>
              {value}
            </span>
          </Typography>
        </Tooltip>
      </Grid2>
    </Grid2>
  );
};

export default InfoItem;
