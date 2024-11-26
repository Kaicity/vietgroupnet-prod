import { Box, styled } from '@mui/material';
import theme from '../utils/theme';

const BoxCard = styled(Box)(() => ({
  position: 'relative',
  backgroundColor: theme.white[100],
  padding: '20px',
  width: '100%',
  marginBottom: '20px',
  height: {
    xs: 'auto',
    md: '100vh',
  },
  maxHeight: {
    xs: 'auto',
    md: '840px',
  },
  overflow: {
    xs: 'visible',
    md: 'hidden',
  },
  '&::before, &::after, & > div::before, & > div::after': {
    content: '""',
    position: 'absolute',
    width: '14px',
    height: '14px',
    border: `2px solid ${theme.gray[500]}`,
    pointerEvents: 'none',
  },
  '&::before': {
    top: '-2px',
    left: '-2px',
    borderRight: 'none',
    borderBottom: 'none',
  },
  '&::after': {
    top: '-2px',
    right: '-2px',
    borderLeft: 'none',
    borderBottom: 'none',
  },
  '& > div::before': {
    bottom: '-2px',
    left: '-2px',
    borderRight: 'none',
    borderTop: 'none',
  },
  '& > div::after': {
    bottom: '-2px',
    right: '-2px',
    borderLeft: 'none',
    borderTop: 'none',
  },
}));

export default BoxCard;
