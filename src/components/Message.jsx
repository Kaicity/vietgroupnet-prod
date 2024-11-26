import { Snackbar, Alert } from "@mui/material";

const Message = ({ isShowMessage, severity, content, handleCloseSnackbar }) => {
  return (
    <Snackbar
      open={isShowMessage}
      autoHideDuration={2000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mt: "80px", mr: "20px" }}
    >
      <Alert onClose={handleCloseSnackbar} severity={severity}>
        {content}
      </Alert>
    </Snackbar>
  );
};

export default Message;
