import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search songs...",
  autoFocus,
}: SearchBarProps) => (
  <TextField
    fullWidth
    autoFocus={autoFocus}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange("")} edge="end">
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 500,
        backgroundColor: "background.paper",
      },
    }}
  />
);

export default SearchBar;
