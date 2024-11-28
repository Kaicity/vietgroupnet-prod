import { Grid, Typography, Tooltip } from '@mui/material';
import theme from '../../../utils/theme';

const InfoItem = ({ icon: IconComponent = () => null, label, value }) => {
  const isXs = window.innerWidth < 600;

  const textContent = `${label} ${value}`;
  const words = textContent.split(' ');
  const isLongText = words.length > 15;

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      sx={{
        marginBottom: '12px',
        flexWrap: isXs ? 'wrap' : 'nowrap',
      }}
    >
      <Grid item style={{ flex: '0 0 auto', marginRight: '8px' }}>
        {IconComponent && <IconComponent style={{ fontSize: isXs ? '18px' : '25px', color: theme.primary[500] }} />}
      </Grid>
      <Grid item xs>
        <Tooltip title={isLongText ? textContent : ''} arrow>
          <Typography
            sx={{
              fontSize: isXs ? '14px' : '16px',
              wordBreak: 'break-word',
              whiteSpace: isXs ? 'normal' : 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            <span style={{ color: theme.black[900], fontWeight: '500' }}>{label}</span>{' '}
            <span style={{ color: theme.gray[500], fontWeight: '500' }}>{value}</span>
          </Typography>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default InfoItem;