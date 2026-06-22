import { useEffect, useState } from 'react';

import { getCustomer, getCustomers, updateCustomerStatus } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';
import formatCurrency from '../../utils/formatCurrency';

const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));

const AdminCustomersPage = () => {
  const { pushToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const toggleCustomer = async (customer) => {
    const response = await updateCustomerStatus(customer._id, !customer.isDisabled);
    setCustomers((current) =>
      current.map((item) => (item._id === customer._id ? { ...item, ...response.data } : item)),
    );
    if (selectedCustomer?._id === customer._id) {
      setSelectedCustomer((current) => ({ ...current, ...response.data }));
    }
    pushToast(response.data.isDisabled ? 'Customer disabled' : 'Customer enabled');
  };

  const viewCustomer = async (customer) => {
    const response = await getCustomer(customer._id);
    setSelectedCustomer(response.data);
  };

  return (
    <AdminLayout title="Customers">
      <section className="admin-panel">
        {loading && <AdminState tone="loading" title="Loading customers" message="Building customer profiles." />}
        {error && <AdminState tone="error" title="Customers unavailable" message={error} />}
        {!loading && !error && customers.length === 0 && (
          <AdminState title="No customers yet" message="Registered shoppers will appear here." />
        )}
        {!loading && !error && customers.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Order Count</th>
                <th>Total Spend</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>{customer.orderCount}</td>
                  <td>{formatCurrency(customer.totalSpend || 0)}</td>
                  <td>
                    <span className={`status-pill ${customer.isDisabled ? 'status-pill--danger' : 'status-pill--success'}`}>
                      {customer.isDisabled ? 'Disabled' : 'Enabled'}
                    </span>
                  </td>
                  <td>
                    <button type="button" onClick={() => viewCustomer(customer)}>View</button>
                    <button type="button" onClick={() => toggleCustomer(customer)}>
                      {customer.isDisabled ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedCustomer && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__card">
            <h2>{selectedCustomer.name}</h2>
            <p>{selectedCustomer.email}</p>
            <dl>
              <div><dt>Joined</dt><dd>{formatDate(selectedCustomer.createdAt)}</dd></div>
              <div><dt>Orders</dt><dd>{selectedCustomer.orderCount}</dd></div>
              <div><dt>Total Spend</dt><dd>{formatCurrency(selectedCustomer.totalSpend || 0)}</dd></div>
              <div><dt>Status</dt><dd>{selectedCustomer.isDisabled ? 'Disabled' : 'Enabled'}</dd></div>
            </dl>
            <h3>Order History</h3>
            {selectedCustomer.orders.length === 0 ? (
              <AdminState title="No order history" message="This customer has not placed an order yet." />
            ) : (
              <div className="admin-detail-list">
                {selectedCustomer.orders.map((order) => (
                  <div key={order._id}>
                    <span>#{order._id.slice(-8).toUpperCase()} · {order.status}</span>
                    <strong>{formatCurrency(order.totalPrice)}</strong>
                  </div>
                ))}
              </div>
            )}
            <div className="admin-actions">
              <button className="secondary-button" type="button" onClick={() => toggleCustomer(selectedCustomer)}>
                {selectedCustomer.isDisabled ? 'Enable Account' : 'Disable Account'}
              </button>
              <button className="secondary-button" type="button" onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomersPage;
