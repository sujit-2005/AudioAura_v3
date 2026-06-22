import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const EmptyState = ({ onClear }) => (
  <motion.div
    className="catalog-state premium-empty-state glass-panel"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="catalog-state__icon" aria-hidden="true">
      0
    </div>
    <h2>No products found</h2>
    <p>Try widening your price range or removing one of the filters.</p>
    <button className="primary-button" type="button" onClick={onClear}>
      Clear filters
    </button>
  </motion.div>
);

EmptyState.propTypes = {
  onClear: PropTypes.func.isRequired,
};

export default EmptyState;
