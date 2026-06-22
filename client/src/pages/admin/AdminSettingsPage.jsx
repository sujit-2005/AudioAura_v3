import { useEffect, useState } from 'react';

import { getSettings, updateSettings } from '../../api/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminState from '../../components/admin/AdminState';
import { useToast } from '../../context/ToastContext';

const fields = [
  ['storeName', 'Store Name', 'text'],
  ['businessEmail', 'Business Email', 'email'],
  ['businessPhone', 'Business Phone', 'text'],
  ['businessAddress', 'Business Address', 'text'],
  ['shippingFee', 'Shipping Fee', 'number'],
  ['freeShippingThreshold', 'Free Shipping Threshold', 'number'],
  ['taxRate', 'Tax Rate', 'number'],
  ['contactEmail', 'Contact Email', 'email'],
  ['contactPhone', 'Contact Phone', 'text'],
];

const AdminSettingsPage = () => {
  const { pushToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSettings()
      .then((response) => setSettings(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const submitSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await updateSettings(settings);
      setSettings(response.data);
      pushToast('Settings saved');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      {loading && <AdminState tone="loading" title="Loading settings" message="Fetching store configuration." />}
      {error && <AdminState tone="error" title="Settings issue" message={error} />}
      {settings && (
        <form className="admin-panel admin-form settings-form" onSubmit={submitSettings}>
          <h2>Store Settings</h2>
          {fields.map(([name, label, type]) => (
            <label key={name}>
              {label}
              <input
                min={type === 'number' ? '0' : undefined}
                onChange={(event) => setSettings((current) => ({ ...current, [name]: event.target.value }))}
                type={type}
                value={settings[name] ?? ''}
              />
            </label>
          ))}
          <button className="primary-button" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminSettingsPage;
