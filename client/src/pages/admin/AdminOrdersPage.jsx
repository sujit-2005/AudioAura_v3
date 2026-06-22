import { useEffect, useState } from 'react';

import { getAdminOrder, getAdminOrders, updateOrderStatus } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';
import formatCurrency from '../../utils/formatCurrency';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));

const AdminOrdersPage = () => {
  const { pushToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminOrders();
      setOrders(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (order, status) => {
    const response = await updateOrderStatus(order._id, status);
    setOrders((current) => current.map((item) => (item._id === order._id ? response.data : item)));
    if (selectedOrder?._id === order._id) setSelectedOrder(response.data);
    pushToast('Order status updated');
  };

  const viewOrder = async (order) => {
    const response = await getAdminOrder(order._id);
    setSelectedOrder(response.data);
  };

  return (
    <AdminLayout title="Orders">
      <section className="admin-panel">
        {loading && <AdminState tone="loading" title="Loading orders" message="Fetching customer orders." />}
        {error && <AdminState tone="error" title="Orders unavailable" message={error} />}
        {!loading && !error && orders.length === 0 && (
          <AdminState title="No orders yet" message="Checkout activity will appear here." />
        )}
        {!loading && !error && orders.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name || order.shippingAddress.fullName}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select value={order.status} onChange={(event) => changeStatus(order, event.target.value)}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td><button type="button" onClick={() => viewOrder(order)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedOrder && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__card">
            <h2>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
            <p>{selectedOrder.shippingAddress.fullName} · {selectedOrder.shippingAddress.email}</p>
            <div className="admin-detail-list">
              {selectedOrder.items.map((item) => (
                <div key={`${item.product}-${item.name}`}>
                  <span>{item.name} x {item.quantity}</span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <dl>
              <div><dt>Shipping</dt><dd>{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</dd></div>
              <div><dt>Status</dt><dd>{selectedOrder.status}</dd></div>
              <div><dt>Total</dt><dd>{formatCurrency(selectedOrder.totalPrice)}</dd></div>
            </dl>
            <button className="secondary-button" type="button" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
