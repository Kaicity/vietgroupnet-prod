import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const BasicDatePicker = ({ value, onChange, error, helperText, label }) => {
  // Cấu hình dayjs để sử dụng ngôn ngữ tiếng Việt
  dayjs.locale('vi');

  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
    onChange(formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        slotProps={{
          textField: {
            error: Boolean(error),
            helperText: helperText,
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
