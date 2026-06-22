import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../api/productService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import ProductImage from '../../components/common/ProductImage';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES } from '../../utils/catalogOptions';
import formatCurrency from '../../utils/formatCurrency';
import { getProductImage, getProductImageAlt } from '../../utils/productImages';

const emptyProduct = {
  name: '',
  brand: '',
  category: 'Headphones',
  shortDescription: '',
  fullDescription: '',
  price: '',
  stock: '',
  imageUrl: '',
  imageAltText: '',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toPayload = (form) => ({
  name: form.name.trim(),
  slug: slugify(form.name),
  brand: form.brand.trim(),
  category: form.category,
  shortDescription: form.shortDescription.trim(),
  fullDescription: form.fullDescription.trim(),
  price: Number(form.price),
  discountPrice: null,
  stock: Number(form.stock),
  rating: 0,
  images: [{ url: form.imageUrl.trim(), altText: form.imageAltText.trim() || form.name.trim() }],
  specifications: [],
});

const AdminProductsPage = () => {
  const { pushToast } = useToast();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalProducts: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProducts({ search, page, limit: 8 });
      setProducts(response.data);
      setMeta({
        page: response.page,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const formTitle = useMemo(
    () => (editingProduct ? `Edit ${editingProduct.name}` : 'Create Product'),
    [editingProduct],
  );

  const validateForm = () => {
    if (form.name.trim().length < 2) return 'Name must contain at least 2 characters';
    if (form.shortDescription.trim().length < 10) return 'Description must contain at least 10 characters';
    if (form.fullDescription.trim().length < 30) return 'Full description must contain at least 30 characters';
    if (Number(form.price) < 0 || Number.isNaN(Number(form.price))) return 'Price must be a valid number';
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) return 'Stock must be a whole number';
    if (!form.imageUrl.trim()) return 'At least one image URL is required';
    return '';
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingProduct(null);
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, toPayload(form));
        pushToast('Product updated');
      } else {
        await createProduct(toPayload(form));
        pushToast('Product created');
      }
      resetForm();
      await loadProducts();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.images?.[0]?.url || '',
      imageAltText: product.images?.[0]?.altText || '',
    });
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    await deleteProduct(product._id);
    pushToast('Product deleted');
    await loadProducts();
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <AdminLayout title="Products">
      <section className="admin-two-column">
        <form className="admin-panel admin-form" onSubmit={handleSubmit}>
          <h2>{formTitle}</h2>
          {formError && <p className="form-error">{formError}</p>}
          {[
            ['name', 'Name'],
            ['brand', 'Brand'],
            ['shortDescription', 'Description'],
            ['fullDescription', 'Full Description'],
            ['price', 'Price'],
            ['stock', 'Stock'],
            ['imageUrl', 'Image URL'],
            ['imageAltText', 'Image Alt Text'],
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                onChange={(event) => updateField(name, event.target.value)}
                required={name !== 'imageAltText'}
                type={['price', 'stock'].includes(name) ? 'number' : 'text'}
                value={form[name]}
              />
            </label>
          ))}
          <label>
            Category
            <select onChange={(event) => updateField('category', event.target.value)} value={form.category}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="admin-actions">
            <button className="primary-button" disabled={saving} type="submit">
              {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
            {editingProduct && (
              <button className="secondary-button" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-panel">
          <div className="admin-toolbar">
            <input
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search products"
              type="search"
              value={search}
            />
            <span>{meta.totalProducts} products</span>
          </div>

          {loading && <AdminState tone="loading" title="Loading products" message="Fetching catalog records." />}
          {error && <AdminState tone="error" title="Unable to load products" message={error} />}
          {!loading && !error && products.length === 0 && (
            <AdminState title="No products found" message="Create a product or refine your search." />
          )}
          {!loading && !error && products.length > 0 && (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{formatCurrency(product.discountPrice ?? product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button type="button" onClick={() => setViewProduct(product)}>View</button>
                        <button type="button" onClick={() => startEdit(product)}>Edit</button>
                        <button type="button" onClick={() => removeProduct(product)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="admin-pagination">
                <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">Prev</button>
                <span>Page {meta.page} of {meta.totalPages || 1}</span>
                <button disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} type="button">Next</button>
              </div>
            </>
          )}
        </div>
      </section>

      {viewProduct && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__card">
            <ProductImage src={getProductImage(viewProduct)} alt={getProductImageAlt(viewProduct)} />
            <h2>{viewProduct.name}</h2>
            <p>{viewProduct.fullDescription}</p>
            <dl>
              <div><dt>Brand</dt><dd>{viewProduct.brand}</dd></div>
              <div><dt>Category</dt><dd>{viewProduct.category}</dd></div>
              <div><dt>Stock</dt><dd>{viewProduct.stock}</dd></div>
            </dl>
            <button className="secondary-button" type="button" onClick={() => setViewProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
