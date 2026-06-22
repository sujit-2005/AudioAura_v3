import { useCallback, useEffect, useState } from 'react';

import { deleteReview, getReviews, updateReviewVisibility } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';

const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));

const AdminReviewsPage = () => {
  const { pushToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ search: '', rating: '', visibility: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getReviews(filters);
      setReviews(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load reviews');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const setHidden = async (review, hidden) => {
    const response = await updateReviewVisibility(review._id, hidden);
    setReviews((current) => current.map((item) => (item._id === review._id ? response.data : item)));
    pushToast(hidden ? 'Review hidden' : 'Review restored');
  };

  const removeReview = async (review) => {
    if (!window.confirm('Delete this review?')) return;
    await deleteReview(review._id);
    setReviews((current) => current.filter((item) => item._id !== review._id));
    pushToast('Review deleted');
  };

  return (
    <AdminLayout title="Reviews">
      <section className="admin-panel">
        <div className="admin-toolbar">
          <input
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search reviews"
            type="search"
            value={filters.search}
          />
          <select onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))} value={filters.rating}>
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <select onChange={(event) => setFilters((current) => ({ ...current, visibility: event.target.value }))} value={filters.visibility}>
            <option value="all">All reviews</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        {loading && <AdminState tone="loading" title="Loading reviews" message="Fetching customer feedback." />}
        {error && <AdminState tone="error" title="Reviews unavailable" message={error} />}
        {!loading && !error && reviews.length === 0 && (
          <AdminState title="No reviews found" message="Reviews matching your filters will appear here." />
        )}
        {!loading && !error && reviews.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.customer?.name || 'Customer'}</td>
                  <td>{review.product?.name || 'Product'}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>{formatDate(review.createdAt)}</td>
                  <td>
                    <button type="button" onClick={() => setHidden(review, !review.isHidden)}>
                      {review.isHidden ? 'Restore' : 'Hide'}
                    </button>
                    <button type="button" onClick={() => removeReview(review)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
