import PropTypes from 'prop-types';

import { SORT_OPTIONS } from '../../utils/catalogOptions';

const SortSelect = ({ value, onChange }) => (
  <label className="sort-select">
    <span>Sort by</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

SortSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SortSelect;
