import { Select } from 'antd';

const SelectionOption = ({ value, onChange, options }) => {
  return (
    <Select
      size="large"
      value={value}
      onChange={onChange}
      style={{
        top: '1px',
        width: '100%',
      }}
      options={options}
    />
  );
};

export default SelectionOption;
