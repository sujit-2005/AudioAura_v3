import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getMyOrders } from '../../api/orderService';
import formatCurrency from '../../utils/formatCurrency';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((response) => setOrders(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.main
      className="page-shell utility-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Account</span>
        <h1>Order history</h1>
      </div>
      {loading && <p className="soft-loading">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <div className="catalog-state premium-empty-state glass-panel">
          <div className="catalog-state__icon" aria-hidden="true">
            0
          </div>
          <h2>No orders yet</h2>
          <p>Your fake checkout history will appear here.</p>
          <Link className="primary-button" to="/products">
            Explore products
          </Link>
        </div>
      )}
      <div className="orders-list">
        {orders.map((order, index) => (
          <motion.article
            className="order-card glass-panel"
            key={order._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div>
              <span className="section-kicker">Order</span>
              <h2>#{order._id.slice(-6).toUpperCase()}</h2>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="status-pill">{order.status}</span>
            <strong>{formatCurrency(order.totalPrice)}</strong>
          </motion.article>
        ))}
      </div>
    </motion.main>
  );
};

export default OrderHistoryPage;
