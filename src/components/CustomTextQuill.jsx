import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import debounce from 'lodash/debounce';
import 'react-quill/dist/quill.snow.css';

const CustomTextQuill = ({
  label,
  value = '',
  onChange,
  toolbarVisible = true,
  readOnly = false,
  height = '200px', // Chiều cao mặc định
  error = false,
  helperText = '',
  placeholder = 'Nhập nội dung...',
}) => {
  const [inputValue, setInputValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((newValue) => onChange(newValue), 300),
    [onChange]
  );

  const handleChange = (newValue) => {
    setInputValue(newValue);
    debouncedOnChange(newValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <FormControl fullWidth error={error}>
      {label && (
        <InputLabel shrink style={{ marginBottom: '8px' }}>
          {label}
        </InputLabel>
      )}
      <ReactQuill
        readOnly={readOnly}
        theme="snow"
        value={inputValue}
        onChange={handleChange}
        modules={{
          toolbar: toolbarVisible && [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
        placeholder={placeholder}
        style={{
          marginTop: '8px',
          height,
          border: error ? '1px solid red' : '1px solid #ced4da',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomTextQuill;
