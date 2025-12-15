import React, { useState, useEffect } from 'react';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        hospitalName: '',
        hospitalAddress: '',
        contactEmail: '',
        contactPhone: '',
        workingHours: '',
        appointmentDuration: 30,
        maxAppointmentsPerDay: 50,
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        maintenanceMode: false,
        currency: 'USD',
        taxRate: 0.08
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/system-settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSettings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/system-settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setSaveMessage('Settings saved successfully!');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage('Error saving settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading settings...</div>;
    }

    return (
        <div className="system-settings">
            <h1 className="page-title">System Settings</h1>

            {saveMessage && (
                <div className={`alert ${saveMessage.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                    {saveMessage}
                </div>
            )}

            <form onSubmit={handleSave} className="settings-form">
                <div className="settings-section">
                    <h2>Hospital Information</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Hospital Name *</label>
                            <input
                                type="text"
                                required
                                value={settings.hospitalName}
                                onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Phone *</label>
                            <input
                                type="tel"
                                required
                                value={settings.contactPhone}
                                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Hospital Address *</label>
                        <textarea
                            required
                            value={settings.hospitalAddress}
                            onChange={(e) => setSettings({ ...settings, hospitalAddress: e.target.value })}
                            rows="2"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Email *</label>
                            <input
                                type="email"
                                required
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Working Hours</label>
                            <input
                                type="text"
                                value={settings.workingHours}
                                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                                placeholder="e.g., 9:00 AM - 5:00 PM"
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Appointment Settings</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Appointment Duration (minutes) *</label>
                            <input
                                type="number"
                                min="5"
                                max="120"
                                required
                                value={settings.appointmentDuration}
                                onChange={(e) => setSettings({ ...settings, appointmentDuration: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Appointments Per Day *</label>
                            <input
                                type="number"
                                min="1"
                                max="200"
                                required
                                value={settings.maxAppointmentsPerDay}
                                onChange={(e) => setSettings({ ...settings, maxAppointmentsPerDay: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Billing & Payment</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tax Rate (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={settings.taxRate * 100}
                                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) / 100 })}
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Notification Settings</h2>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.enableEmailNotifications}
                                onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                            />
                            <span>Enable Email Notifications</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.enableSMSNotifications}
                                onChange={(e) => setSettings({ ...settings, enableSMSNotifications: e.target.checked })}
                            />
                            <span>Enable SMS Notifications</span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>System Status</h2>
                    <div className="checkbox-group">
                        <label className="checkbox-label warning">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            />
                            <span>Maintenance Mode</span>
                            <small className="warning-text">
                                When enabled, only admins can access the system
                            </small>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={fetchSettings}
                    >
                        Reset Changes
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SystemSettings;