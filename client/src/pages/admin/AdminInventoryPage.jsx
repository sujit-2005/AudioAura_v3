import { useEffect, useMemo, useState } from 'react';

import { getInventory, updateInventory } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';

const getStockStatus = (stock) => {
  if (stock === 0) return ['Out Of Stock', 'danger'];
  if (stock < 5) return ['Low Stock', 'warning'];
  return ['In Stock', 'success'];
};

const AdminInventoryPage = () => {
  const { pushToast } = useToast();
  const [products, setProducts] = useState([]);
  const [draftStock, setDraftStock] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getInventory();
      setProducts(response.data);
      setDraftStock(Object.fromEntries(response.data.map((product) => [product._id, product.stock])));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const summary = useMemo(
    () => ({
      low: products.filter((product) => product.stock > 0 && product.stock < 5).length,
      out: products.filter((product) => product.stock === 0).length,
      total: products.reduce((sum, product) => sum + product.stock, 0),
    }),
    [products],
  );

  const updateStock = async (product, payload) => {
    const response = await updateInventory(product._id, payload);
    setProducts((current) =>
      current.map((item) => (item._id === product._id ? response.data : item)),
    );
    setDraftStock((current) => ({ ...current, [product._id]: response.data.stock }));
    pushToast('Stock updated');
  };

  return (
    <AdminLayout title="Inventory">
      <section className="admin-card-grid">
        <article className="admin-stat-card"><span>Total Units</span><strong>{summary.total}</strong></article>
        <article className="admin-stat-card"><span>Low Stock</span><strong>{summary.low}</strong></article>
        <article className="admin-stat-card"><span>Out Of Stock</span><strong>{summary.out}</strong></article>
      </section>

      <section className="admin-panel">
        {loading && <AdminState tone="loading" title="Loading inventory" message="Checking stock levels." />}
        {error && <AdminState tone="error" title="Inventory unavailable" message={error} />}
        {!loading && !error && products.length === 0 && (
          <AdminState title="No products found" message="Create products before managing inventory." />
        )}
        {!loading && !error && products.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const [label, tone] = getStockStatus(product.stock);

                return (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td><span className={`status-pill status-pill--${tone}`}>{label}</span></td>
                    <td>
                      <div className="stock-controls">
                        <button type="button" onClick={() => updateStock(product, { action: 'decrease', amount: 1 })}>-</button>
                        <input
                          min="0"
                          onChange={(event) =>
                            setDraftStock((current) => ({ ...current, [product._id]: event.target.value }))
                          }
                          type="number"
                          value={draftStock[product._id] ?? product.stock}
                        />
                        <button type="button" onClick={() => updateStock(product, { action: 'increase', amount: 1 })}>+</button>
                        <button
                          type="button"
                          onClick={() => updateStock(product, { stock: Number(draftStock[product._id]) })}
                        >
                          Set
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminInventoryPage;
