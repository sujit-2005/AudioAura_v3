import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className="catalog-state catalog-state--error glass-panel"
    role="alert"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="catalog-state__icon" aria-hidden="true">
      !
    </div>
    <h2>We could not load this view</h2>
    <p>{message}</p>
    {onRetry && (
      <button className="primary-button" type="button" onClick={onRetry}>
        Try again
      </button>
    )}
  </motion.div>
);

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorState.defaultProps = {
  onRetry: undefined,
};

export default ErrorState;
