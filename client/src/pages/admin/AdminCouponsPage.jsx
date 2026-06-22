import { useEffect, useState } from 'react';

import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';

const emptyCoupon = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  expiryDate: '',
  usageLimit: '',
  isEnabled: true,
};

const AdminCouponsPage = () => {
  const { pushToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyCoupon);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCoupons();
      setCoupons(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const payload = () => ({
    ...form,
    code: form.code.toUpperCase().trim(),
    discountValue: Number(form.discountValue),
    usageLimit: Number(form.usageLimit),
  });

  const submitCoupon = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, payload());
        pushToast('Coupon updated');
      } else {
        await createCoupon(payload());
        pushToast('Coupon created');
      }
      setForm(emptyCoupon);
      setEditingCoupon(null);
      await loadCoupons();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Unable to save coupon');
    }
  };

  const editCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      expiryDate: coupon.expiryDate.slice(0, 10),
      usageLimit: String(coupon.usageLimit),
      isEnabled: coupon.isEnabled,
    });
  };

  const removeCoupon = async (coupon) => {
    if (!window.confirm(`Delete ${coupon.code}?`)) return;
    await deleteCoupon(coupon._id);
    pushToast('Coupon deleted');
    await loadCoupons();
  };

  const toggleCoupon = async (coupon) => {
    await updateCoupon(coupon._id, { isEnabled: !coupon.isEnabled });
    pushToast(coupon.isEnabled ? 'Coupon disabled' : 'Coupon enabled');
    await loadCoupons();
  };

  return (
    <AdminLayout title="Coupons">
      <section className="admin-two-column">
        <form className="admin-panel admin-form" onSubmit={submitCoupon}>
          <h2>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
          {formError && <p className="form-error">{formError}</p>}
          <label>Code<input required value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} placeholder="WELCOME10" /></label>
          <label>Discount Type<select value={form.discountType} onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value }))}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></label>
          <label>Discount Value<input required min="0" type="number" value={form.discountValue} onChange={(event) => setForm((current) => ({ ...current, discountValue: event.target.value }))} /></label>
          <label>Expiry Date<input required type="date" value={form.expiryDate} onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))} /></label>
          <label>Usage Limit<input required min="1" type="number" value={form.usageLimit} onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value }))} /></label>
          <label className="checkbox-label"><input type="checkbox" checked={form.isEnabled} onChange={(event) => setForm((current) => ({ ...current, isEnabled: event.target.checked }))} />Enabled</label>
          <div className="admin-actions">
            <button className="primary-button" type="submit">{editingCoupon ? 'Save Changes' : 'Create Coupon'}</button>
            {editingCoupon && <button className="secondary-button" type="button" onClick={() => { setEditingCoupon(null); setForm(emptyCoupon); }}>Cancel</button>}
          </div>
        </form>
        <div className="admin-panel">
          {loading && <AdminState tone="loading" title="Loading coupons" message="Fetching promotions." />}
          {error && <AdminState tone="error" title="Coupons unavailable" message={error} />}
          {!loading && !error && coupons.length === 0 && <AdminState title="No coupons yet" message="Create WELCOME10, AUDIO20, or FESTIVE50 to start." />}
          {!loading && !error && coupons.length > 0 && (
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Expiry</th><th>Usage</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : coupon.discountValue}</td>
                  <td>{coupon.expiryDate.slice(0, 10)}</td>
                  <td>{coupon.usedCount}/{coupon.usageLimit}</td>
                  <td><span className={`status-pill ${coupon.isEnabled ? 'status-pill--success' : 'status-pill--danger'}`}>{coupon.isEnabled ? 'Enabled' : 'Disabled'}</span></td>
                  <td><button type="button" onClick={() => editCoupon(coupon)}>Edit</button><button type="button" onClick={() => toggleCoupon(coupon)}>{coupon.isEnabled ? 'Disable' : 'Enable'}</button><button type="button" onClick={() => removeCoupon(coupon)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminCouponsPage;
