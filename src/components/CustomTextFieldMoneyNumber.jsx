import { TextField, Grid, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { transformNumericToMoney } from '../helper';

const CustomTextFieldMoneyNumber = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  endAdornmentTitle,
  gridProps = {},
  ...props
}) => {
  const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = transformNumericToMoney(value);
    return isNaN(numberValue) ? '' : new Intl.NumberFormat('vi-VN').format(numberValue);
  };

  const handleChange = (e) => {
    const formattedValue = formatCurrency(e.target.value);
    onChange({ target: { name, value: formattedValue } });
  };

  useEffect(() => {
    if (value) {
      onChange({ target: { name, value: formatCurrency(value) } });
    }
  }, []);

  return (
    <Grid item {...gridProps}>
      <TextField
        size="medium"
        fullWidth
        variant="outlined"
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={!!error}
        helperText={helperText}
        placeholder={placeholder}
        InputProps={{
          endAdornment: <InputAdornment position="end">{endAdornmentTitle}</InputAdornment>,
        }}
        {...props}
        InputLabelProps={{
          shrink: true, // Giúp label luôn thu nhỏ khi có giá trị
        }}
      />
    </Grid>
  );
};

export default CustomTextFieldMoneyNumber;
