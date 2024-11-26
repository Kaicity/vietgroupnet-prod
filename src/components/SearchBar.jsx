import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import typography from '../utils/typography';

const SearchBar = ({
  placeholder,
  color,
  width,
  border,
  onChange,
  disableBtnSearch,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        height={40}
        minWidth="350px"
        display="flex"
        borderRadius="8px"
        sx={{ backgroundColor: color, width: width, border: border }}
      >
        <InputBase
          sx={{
            ml: 2,
            flex: 1,
            fontSize: typography.fontSize.sizeS,
          }}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        ></InputBase>
        <IconButton type="button" sx={{ p: 1 }} disabled={disableBtnSearch}>
          <SearchIcon></SearchIcon>
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchBar;
