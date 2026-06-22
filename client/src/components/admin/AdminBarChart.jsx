import PropTypes from 'prop-types';

const AdminBarChart = ({ data, labelKey = '_id', valueKey = 'value' }) => {
  const maxValue = Math.max(...data.map((item) => Number(item[valueKey]) || 0), 1);

  return (
    <div className="admin-chart-bars">
      {data.map((item) => {
        const value = Number(item[valueKey]) || 0;

        return (
          <div key={item[labelKey]}>
            <span style={{ height: `${Math.max((value / maxValue) * 100, 4)}%` }} />
            <small>{item[labelKey]}</small>
          </div>
        );
      })}
    </div>
  );
};

AdminBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
};

export default AdminBarChart;
