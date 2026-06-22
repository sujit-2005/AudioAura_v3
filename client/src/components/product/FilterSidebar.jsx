import PropTypes from 'prop-types';

import {
  BRANDS,
  CATEGORIES,
  RATING_OPTIONS,
} from '../../utils/catalogOptions';

const FilterGroup = ({ title, children }) => (
  <fieldset className="filter-group">
    <legend>{title}</legend>
    {children}
  </fieldset>
);

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const RadioOption = ({ name, value, checked, label, onChange }) => (
  <label className="filter-option">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
    />
    <span className="filter-option__control" />
    <span>{label}</span>
  </label>
);

RadioOption.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const FilterSidebar = ({ filters, onChange, onClear }) => (
  <aside className="filters" aria-label="Product filters">
    <div className="filters__heading">
      <h2>Filters</h2>
      <button type="button" onClick={onClear}>
        Clear all
      </button>
    </div>

    <FilterGroup title="Category">
      <RadioOption
        name="category"
        value=""
        label="All categories"
        checked={!filters.category}
        onChange={(value) => onChange('category', value)}
      />
      {CATEGORIES.map((category) => (
        <RadioOption
          key={category}
          name="category"
          value={category}
          label={category}
          checked={filters.category === category}
          onChange={(value) => onChange('category', value)}
        />
      ))}
    </FilterGroup>

    <FilterGroup title="Brand">
      <label className="select-field">
        <span className="sr-only">Filter by brand</span>
        <select
          value={filters.brand}
          onChange={(event) => onChange('brand', event.target.value)}
        >
          <option value="">All brands</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>
    </FilterGroup>

    <FilterGroup title="Price range">
      <div className="price-range">
        <label>
          <span>Min</span>
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice}
              onChange={(event) => onChange('minPrice', event.target.value)}
            />
          </div>
        </label>
        <span className="price-range__dash">-</span>
        <label>
          <span>Max</span>
          <div className="price-input">
            <span>$</span>
            <input
              type="number"
              min="0"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(event) => onChange('maxPrice', event.target.value)}
            />
          </div>
        </label>
      </div>
    </FilterGroup>

    <FilterGroup title="Minimum rating">
      <RadioOption
        name="rating"
        value=""
        label="Any rating"
        checked={!filters.rating}
        onChange={(value) => onChange('rating', value)}
      />
      {RATING_OPTIONS.map((option) => (
        <RadioOption
          key={option.value}
          name="rating"
          value={option.value}
          label={option.label}
          checked={filters.rating === option.value}
          onChange={(value) => onChange('rating', value)}
        />
      ))}
    </FilterGroup>
  </aside>
);

FilterSidebar.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    minPrice: PropTypes.string.isRequired,
    maxPrice: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default FilterSidebar;
