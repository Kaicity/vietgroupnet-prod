import { Snackbar, Alert, Typography } from '@mui/material';
import theme from '../utils/theme';
import { CheckCircleOutlineOutlined, ErrorOutline, InfoOutlined, WarningAmberOutlined } from '@mui/icons-material';

const Message = ({ isShowMessage, severity, content, handleCloseSnackbar }) => {
  // Lựa chọn icon dựa trên severity
  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleOutlineOutlined fontSize="inherit" />;
      case 'error':
        return <ErrorOutline fontSize="inherit" />;
      case 'warning':
        return <WarningAmberOutlined fontSize="inherit" />;
      case 'info':
        return <InfoOutlined fontSize="inherit" />;
      default:
        return null;
    }
  };

  return (
    <Snackbar
      open={isShowMessage}
      autoHideDuration={2000} // Ẩn sau 2 giây
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={severity}
        icon={getIcon(severity)}
        sx={{
          background: 'white',
          color: 'black',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Title */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: 'inherit' }}>
          Thông báo
        </Typography>
        <Typography sx={{ color: theme.gray[500] }}> {content}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default Message;
