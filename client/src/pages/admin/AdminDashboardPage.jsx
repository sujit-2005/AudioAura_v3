import { useEffect, useMemo, useState } from 'react';

import { getDashboard } from '../../api/adminService';
import AdminBarChart from '../../components/admin/AdminBarChart';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import AdminStatCard from '../../components/admin/AdminStatCard';
import formatCurrency from '../../utils/formatCurrency';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((response) => setDashboard(response.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => {
    const metrics = dashboard?.metrics || {};
    const analytics = dashboard?.analytics || {};

    return [
      ['Total Revenue', formatCurrency(metrics.totalRevenue || 0)],
      ['Total Orders', metrics.totalOrders || 0],
      ['Total Products', metrics.totalProducts || 0],
      ['Total Customers', metrics.totalCustomers || 0],
      ['Revenue Today', formatCurrency(analytics.revenueToday || 0)],
      ['Revenue This Week', formatCurrency(analytics.revenueThisWeek || 0)],
      ['Revenue This Month', formatCurrency(analytics.revenueThisMonth || 0)],
      ['Revenue This Year', formatCurrency(analytics.revenueThisYear || 0)],
      ['Orders Today', analytics.ordersToday || 0],
      ['Orders This Week', analytics.ordersThisWeek || 0],
      ['Orders This Month', analytics.ordersThisMonth || 0],
      ['Revenue Growth', `${analytics.revenueGrowth || 0}%`],
    ];
  }, [dashboard]);

  return (
    <AdminLayout title="Dashboard">
      {loading && <AdminState tone="loading" title="Loading dashboard" message="Collecting store metrics." />}
      {error && <AdminState tone="error" title="Dashboard unavailable" message={error} />}
      {dashboard && (
        <>
          <section className="admin-card-grid">
            {cards.map(([label, value]) => (
              <AdminStatCard key={label} label={label} value={value} />
            ))}
          </section>

          <section className="admin-dashboard-grid">
            <div className="admin-panel">
              <h2>Revenue Trends</h2>
              {dashboard.analytics.revenueTrend.length === 0 ? (
                <AdminState title="No trend data" message="Revenue trends appear after orders are placed." />
              ) : (
                <AdminBarChart data={dashboard.analytics.revenueTrend} valueKey="revenue" />
              )}
            </div>

            <div className="admin-panel">
              <h2>Order Trends</h2>
              {dashboard.analytics.revenueTrend.length === 0 ? (
                <AdminState title="No order data" message="Order trend charts need checkout activity." />
              ) : (
                <AdminBarChart data={dashboard.analytics.revenueTrend} valueKey="orders" />
              )}
            </div>

            <div className="admin-panel">
              <h2>Top Selling Products</h2>
              {dashboard.analytics.topSellingProducts.length === 0 ? (
                <AdminState title="No product sales yet" message="Top products appear after orders are placed." />
              ) : (
                <AdminBarChart data={dashboard.analytics.topSellingProducts} labelKey="name" valueKey="units" />
              )}
            </div>

            <div className="admin-panel">
              <h2>Category Performance</h2>
              {dashboard.analytics.categoryPerformance.length === 0 ? (
                <AdminState title="No category sales yet" message="Category performance appears after orders are placed." />
              ) : (
                <AdminBarChart data={dashboard.analytics.categoryPerformance} valueKey="value" />
              )}
            </div>

            <div className="admin-panel">
              <h2>Recent Orders</h2>
              {dashboard.recentOrders.length === 0 ? (
                <AdminState title="No orders yet" message="Orders will appear here as customers check out." />
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.user?.email || order.shippingAddress.email}</td>
                        <td><span className="status-pill">{order.status}</span></td>
                        <td>{formatCurrency(order.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="admin-panel">
              <h2>Recent Customers</h2>
              {dashboard.recentCustomers.length === 0 ? (
                <AdminState title="No customers yet" message="Registered customers will appear here." />
              ) : (
                <div className="admin-list">
                  {dashboard.recentCustomers.map((customer) => (
                    <article key={customer._id}>
                      <strong>{customer.name}</strong>
                      <span>{customer.email}</span>
                      <small>Joined {formatDate(customer.createdAt)}</small>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel admin-panel--wide">
              <h2>Low Stock Products</h2>
              {dashboard.lowStockProducts.length === 0 ? (
                <AdminState title="Inventory is healthy" message="No products are below the 5 unit threshold." />
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.lowStockProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td><span className="status-pill status-pill--danger">{product.stock}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
