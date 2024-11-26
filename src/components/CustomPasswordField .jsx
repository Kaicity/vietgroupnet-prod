import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { useState } from 'react';

const CustomPasswordField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  marginRight = '0px',
  marginLeft = '0px',
  marginbottom = '10px',
  placeholder,
  width = '100%',
  gridProps = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid item {...gridProps}>
      <TextField
        size="medium"
        fullWidth
        variant="outlined"
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
        helperText={helperText}
        placeholder={placeholder}
        sx={{
          marginRight: marginRight,
          marginLeft: marginLeft,
          marginBottom: marginbottom,
          width: width || '100%',
          ...props.sx,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </Grid>
  );
};

export default CustomPasswordField;
