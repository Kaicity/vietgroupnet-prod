import { keyframes } from '@mui/system';
import theme from '../utils/theme';

// Define a combined shake and blink animation
export const blinkBackgroundAnimation = keyframes`
    50% {
        background-color: ${theme.redAccent[100]}
`;