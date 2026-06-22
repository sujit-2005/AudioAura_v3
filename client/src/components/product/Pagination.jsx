import PropTypes from 'prop-types';

const ArrowIcon = ({ direction }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={direction === 'next' ? 'arrow-next' : ''}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

ArrowIcon.propTypes = {
  direction: PropTypes.oneOf(['previous', 'next']).isRequired,
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Catalog pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowIcon direction="previous" />
        Previous
      </button>
      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ArrowIcon direction="next" />
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
