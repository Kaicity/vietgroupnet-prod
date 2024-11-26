import React, { memo, useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';

const CustomTextField = memo(
  ({ name, label, value, onChange, onBlur, error, helperText, placeholder, gridProps = {}, disable, ...props }) => {
    const [inputValue, setInputValue] = useState(value);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleChange = (event) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        onChange(event);
      }, 300);

      setDebounceTimeout(timeout);
    };

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      return () => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
      };
    }, [debounceTimeout]);

    return (
      <Grid item {...gridProps}>
        <TextField
          size="medium"
          fullWidth
          variant="outlined"
          label={label}
          name={name}
          value={inputValue}
          onChange={handleChange}
          onBlur={onBlur}
          error={!!error}
          helperText={helperText}
          placeholder={placeholder}
          disabled={disable}
          {...props}
        />
      </Grid>
    );
  },
);

export default CustomTextField;
