import PropTypes from 'prop-types';

const AdminStatCard = ({ label, value }) => (
  <article className="admin-stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
);

AdminStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default AdminStatCard;
