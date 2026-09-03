import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPricing = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const emptyForm = { vehicle: '', packageHours: 4, includedKm: 40, packagePrice: 1800, extraHourPrice: 450, extraKmPrice: 20 };
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [pkgRes, carRes] = await Promise.all([
                axios.get('/api/pricing'),
                axios.get('/api/cars'),
            ]);
            setPackages(pkgRes.data.pricing || []);
            setVehicles(carRes.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError(''); setSuccessMsg('');
        try {
            if (editId) {
                await axios.put(`/api/pricing/${editId}`, form);
                setSuccessMsg('Package updated successfully!');
            } else {
                await axios.post('/api/pricing', form);
                setSuccessMsg('Package created successfully!');
            }
            setShowForm(false);
            setEditId(null);
            setForm(emptyForm);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save pricing');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (pkg) => {
        setForm({
            vehicle: pkg.vehicle?._id || pkg.vehicle || '',
            packageHours: pkg.packageHours,
            includedKm: pkg.includedKm,
            packagePrice: pkg.packagePrice,
            extraHourPrice: pkg.extraHourPrice,
            extraKmPrice: pkg.extraKmPrice,
        });
        setEditId(pkg._id);
        setShowForm(true);
        setError(''); setSuccessMsg('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this pricing package?')) return;
        try {
            await axios.delete(`/api/pricing/${id}`);
            setSuccessMsg('Package deleted.');
            fetchAll();
        } catch { setError('Failed to delete.'); }
    };

    const updateField = (field, val) => setForm(f => ({ ...f, [field]: val }));

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate(-1)} style={bk}>← Back</button>
                <div style={{ flex: 1 }}>
                    <h1 className="heading text-gradient" style={{ margin: 0, fontSize: 'clamp(1.3rem,4vw,1.8rem)' }}>
                        💰 Pricing Management
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.82rem', margin: '4px 0 0 0' }}>Configure packages for each vehicle</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); setError(''); setSuccessMsg(''); }}
                    className="btn-primary"
                    style={{ padding: '10px 22px' }}
                >
                    {showForm ? '✕ Cancel' : '＋ New Package'}
                </button>
            </div>

            {successMsg && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '1rem', color: '#10b981', marginBottom: '1.5rem', fontWeight: 600 }}>
                    ✅ {successMsg}
                </div>
            )}

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1rem', color: '#ef4444', marginBottom: '1.5rem', fontWeight: 600 }}>
                    ❌ {error}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '3px solid #f5b754' }}>
                    <h3 style={{ color: '#f5b754', marginBottom: '1.5rem' }}>{editId ? 'Edit Package' : 'New Pricing Package'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={lbl}>Vehicle</label>
                            <select value={form.vehicle} onChange={e => updateField('vehicle', e.target.value)} style={inp} required>
                                <option value="">Select Vehicle</option>
                                {vehicles.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Package Hours</label>
                            <select value={form.packageHours} onChange={e => updateField('packageHours', Number(e.target.value))} style={inp}>
                                <option value={4}>4 Hours</option>
                                <option value={8}>8 Hours</option>
                                <option value={12}>12 Hours</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Included KM</label>
                            <input type="number" value={form.includedKm} onChange={e => updateField('includedKm', Number(e.target.value))} style={inp} min={1} required />
                        </div>
                        <div>
                            <label style={lbl}>Package Price (₹)</label>
                            <input type="number" value={form.packagePrice} onChange={e => updateField('packagePrice', Number(e.target.value))} style={inp} min={0} required />
                        </div>
                        <div>
                            <label style={lbl}>Extra Hour Rate (₹/hr)</label>
                            <input type="number" value={form.extraHourPrice} onChange={e => updateField('extraHourPrice', Number(e.target.value))} style={inp} min={0} />
                        </div>
                        <div>
                            <label style={lbl}>Extra KM Rate (₹/km)</label>
                            <input type="number" value={form.extraKmPrice} onChange={e => updateField('extraKmPrice', Number(e.target.value))} style={inp} min={0} />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '12px 28px', opacity: saving ? 0.7 : 1 }}>
                                {saving ? '⏳ Saving...' : editId ? '✓ Update Package' : '✓ Create Package'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', borderRadius: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Packages list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>⏳ Loading packages...</div>
            ) : packages.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
                    <h3 style={{ color: '#aaa' }}>No pricing packages yet</h3>
                    <p style={{ color: '#555', fontSize: '0.88rem' }}>Click "+ New Package" to add the first pricing package for a vehicle.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
                    {packages.map(pkg => (
                        <div key={pkg._id} className="glass-panel" style={{ padding: '1.5rem', borderTop: '3px solid rgba(245,183,84,0.4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                                        {pkg.vehicle?.name || 'Unknown Vehicle'}
                                    </div>
                                    <div style={{ color: '#f5b754', fontWeight: 700, fontSize: '1.4rem', marginTop: '2px' }}>
                                        {pkg.packageHours}H Package
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5b754' }}>₹{pkg.packagePrice?.toLocaleString('en-IN')}</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                                <PkgDetail label="Included KM" value={`${pkg.includedKm} km`} />
                                <PkgDetail label="Hours" value={`${pkg.packageHours} hrs`} />
                                <PkgDetail label="+ Extra Hour" value={`₹${pkg.extraHourPrice}/hr`} />
                                <PkgDetail label="+ Extra KM" value={`₹${pkg.extraKmPrice}/km`} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => handleEdit(pkg)} style={{ flex: 1, padding: '9px', background: 'rgba(245,183,84,0.1)', border: '1px solid rgba(245,183,84,0.3)', color: '#f5b754', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                                    ✏️ Edit
                                </button>
                                <button onClick={() => handleDelete(pkg._id)} style={{ flex: 1, padding: '9px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const bk = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', transition: 'color 0.2s', flexShrink: 0 };
const lbl = { display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '0.88rem', fontWeight: 600 };
const inp = { width: '100%', padding: '10px 13px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

function PkgDetail({ label, value }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 10px' }}>
            <div style={{ color: '#555', fontSize: '0.72rem', marginBottom: '2px' }}>{label}</div>
            <div style={{ color: '#ddd', fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
        </div>
    );
}

export default AdminPricing;
