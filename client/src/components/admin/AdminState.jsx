import PropTypes from 'prop-types';

const AdminState = ({ action, message, title, tone = 'empty' }) => (
  <div className={`admin-state admin-state--${tone}`}>
    <strong>{title}</strong>
    <p>{message}</p>
    {action}
  </div>
);

AdminState.propTypes = {
  action: PropTypes.node,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['empty', 'error', 'loading']),
};

export default AdminState;
