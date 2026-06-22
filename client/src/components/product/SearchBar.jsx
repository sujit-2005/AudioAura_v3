import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import useDebouncedValue from '../../hooks/useDebouncedValue';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const SearchBar = ({ value, onSearch }) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebouncedValue(inputValue, 400);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  return (
    <label className="search-bar">
      <span className="sr-only">Search products</span>
      <SearchIcon />
      <input
        type="search"
        placeholder="Search by product, brand, or category"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
    </label>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
