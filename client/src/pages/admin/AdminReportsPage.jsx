import { useEffect, useState } from 'react';

import { exportReport, getInsights, getNotifications, getReports } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { useToast } from '../../context/ToastContext';
import formatCurrency from '../../utils/formatCurrency';

const reportTypes = ['sales', 'revenue', 'inventory', 'customers'];

const AdminReportsPage = () => {
  const { pushToast } = useToast();
  const [reports, setReports] = useState(null);
  const [insights, setInsights] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getReports(), getInsights(), getNotifications()])
      .then(([reportsResponse, insightsResponse, notificationsResponse]) => {
        setReports(reportsResponse.data);
        setInsights(insightsResponse.data);
        setNotifications(notificationsResponse);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const downloadReport = async (type, format) => {
    const blob = await exportReport(type, format);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audioaura-${type}-report.${format === 'xlsx' ? 'xls' : 'csv'}`;
    link.click();
    URL.revokeObjectURL(url);
    pushToast('Report exported');
  };

  return (
    <AdminLayout title="Reports">
      {loading && <AdminState tone="loading" title="Loading reports" message="Preparing business summaries." />}
      {error && <AdminState tone="error" title="Reports unavailable" message={error} />}
      {!loading && !error && reports && insights && (
        <>
          <section className="admin-card-grid">
            <AdminStatCard label="Sales Report" value={`${reports.salesReport.totalOrders} orders`} />
            <AdminStatCard label="Revenue Report" value={formatCurrency(reports.revenueReport.totalRevenue)} />
            <AdminStatCard label="Inventory Report" value={`${reports.inventoryReport.lowStockCount} low stock`} />
            <AdminStatCard label="Customer Report" value={`${reports.customerReport.totalCustomers} customers`} />
          </section>

          <section className="admin-dashboard-grid">
            <div className="admin-panel">
              <h2>Export Reports</h2>
              <div className="admin-list">
                {reportTypes.map((type) => (
                  <article key={type}>
                    <strong>{type[0].toUpperCase() + type.slice(1)} Report</strong>
                    <div className="admin-actions">
                      <button type="button" onClick={() => downloadReport(type, 'csv')}>CSV</button>
                      <button type="button" onClick={() => downloadReport(type, 'xlsx')}>Excel</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <h2>Business Insights</h2>
              <div className="admin-detail-list">
                <div><span>Best Selling Product</span><strong>{insights.bestSellingProduct?.name || 'No sales yet'}</strong></div>
                <div><span>Highest Revenue Product</span><strong>{insights.highestRevenueProduct?.name || 'No sales yet'}</strong></div>
                <div><span>Highest Revenue Category</span><strong>{insights.highestRevenueCategory?._id || 'No sales yet'}</strong></div>
                <div><span>Most Active Customer</span><strong>{insights.mostActiveCustomer?.email || 'No orders yet'}</strong></div>
                <div><span>Low Stock Alerts</span><strong>{insights.lowStockAlerts.length}</strong></div>
              </div>
            </div>

            <div className="admin-panel admin-panel--wide">
              <h2>Notification Center <span className="status-pill">{notifications.unreadCount} unread</span></h2>
              {notifications.data.length === 0 ? (
                <AdminState title="No notifications" message="New order, inventory, customer, and coupon notices will appear here." />
              ) : (
                <div className="admin-list">
                  {notifications.data.map((notification, index) => (
                    <article key={`${notification.type}-${index}`}>
                      <strong>{notification.type}</strong>
                      <span>{notification.message}</span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReportsPage;
