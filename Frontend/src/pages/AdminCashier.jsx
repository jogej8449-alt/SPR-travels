import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const statusColor = s => s === 'CONFIRMED' ? '#10b981' : s === 'WAITING_FOR_CASH' ? '#f59e0b' : '#a0aec0';

const AdminCashier = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tab, setTab] = useState('pending');
    const [pendingBookings, setPendingBookings] = useState([]);
    const [collectedBookings, setCollectedBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Confirm dialog
    const [confirmingId, setConfirmingId] = useState(null);
    const [cashInput, setCashInput] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState('');
    const [confirmSuccess, setConfirmSuccess] = useState('');

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'cashier')) {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pendRes, collRes] = await Promise.all([
                axios.get('/api/cash/pending'),
                axios.get('/api/cash/collected'),
            ]);
            setPendingBookings(pendRes.data.bookings || []);
            setCollectedBookings(collRes.data.bookings || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleConfirmCash = async (bookingId) => {
        setConfirmLoading(true);
        setConfirmError('');
        setConfirmSuccess('');
        try {
            const { data } = await axios.post(`/api/cash/${bookingId}/confirm`, {
                amount_received: Number(cashInput)
            });
            if (data.success) {
                setConfirmSuccess(`✓ ${data.message} | Booking ID: ${data.booking.booking_id}`);
                setConfirmingId(null);
                setCashInput('');
                fetchData(); // Refresh lists
            }
        } catch (err) {
            setConfirmError(err.response?.data?.message || 'Confirmation failed');
        } finally {
            setConfirmLoading(false);
        }
    };

    const pendingBooking = confirmingId ? pendingBookings.find(b => b._id === confirmingId) : null;

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate(-1)} style={bk}>← Back</button>
                <div>
                    <h1 className="heading text-gradient" style={{ margin: 0, fontSize: 'clamp(1.3rem,4vw,1.8rem)' }}>
                        💵 Cashier Portal
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.82rem', margin: '4px 0 0 0' }}>Cash Collection Management</p>
                </div>
                <button onClick={fetchData} style={{ marginLeft: 'auto', padding: '9px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                    ↻ Refresh
                </button>
            </div>

            {/* Success message */}
            {confirmSuccess && (
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '1rem', color: '#10b981', marginBottom: '1.5rem', fontWeight: 600 }}>
                    ✅ {confirmSuccess}
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {[
                    { key: 'pending', label: `⏳ Pending Cash (${pendingBookings.length})` },
                    { key: 'collected', label: `✓ Collected (${collectedBookings.length})` },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                            padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
                            background: tab === t.key ? '#f5b754' : 'transparent',
                            color: tab === t.key ? '#000' : '#aaa',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Confirm Cash Modal */}
            {confirmingId && pendingBooking && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div style={{ maxWidth: '430px', width: '100%', background: '#0d1a30', border: '1px solid rgba(245,183,84,0.3)', borderRadius: '16px', padding: '2rem' }}>
                        <h3 style={{ color: '#f5b754', marginBottom: '1rem', fontSize: '1.2rem' }}>💵 Confirm Cash Payment</h3>

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{pendingBooking.car?.name || 'Vehicle'}</div>
                            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                {pendingBooking.user?.name} · {pendingBooking.occasion}
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                📅 {pendingBooking.startDate ? new Date(pendingBooking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} · {pendingBooking.startTime}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>AMOUNT DUE</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f5b754', marginBottom: '1rem' }}>
                                ₹{pendingBooking.totalPrice?.toLocaleString('en-IN')}
                            </div>
                            <label style={{ display: 'block', color: '#aaa', fontSize: '0.88rem', marginBottom: '6px', fontWeight: 600 }}>{pendingBooking.totalPrice > 0 ? "Enter Exact Amount Received (₹)" : "Enter Final Negotiated Amount Received (₹)"}</label>
                            <input
                                type="number"
                                placeholder={pendingBooking.totalPrice > 0 ? `Must be exactly ₹${pendingBooking.totalPrice}` : "Enter the amount actually collected"}
                                value={cashInput}
                                onChange={e => setCashInput(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box', fontWeight: 700 }}
                            />
                        </div>

                        {confirmError && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ef4444', fontSize: '0.88rem', marginBottom: '1rem', fontWeight: 600 }}>
                                ❌ {confirmError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => handleConfirmCash(confirmingId)}
                                disabled={confirmLoading || !cashInput}
                                className="btn-primary"
                                style={{ flex: 1, opacity: !cashInput ? 0.4 : 1, cursor: !cashInput ? 'not-allowed' : 'pointer' }}
                            >
                                {confirmLoading ? '⏳ Confirming...' : '✓ CONFIRM CASH'}
                            </button>
                            <button
                                onClick={() => { setConfirmingId(null); setCashInput(''); setConfirmError(''); }}
                                style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>⏳ Loading...</div>
            ) : tab === 'pending' ? (
                <PendingList bookings={pendingBookings} onConfirm={id => { setConfirmingId(id); setCashInput(''); setConfirmError(''); setConfirmSuccess(''); }} />
            ) : (
                <CollectedList bookings={collectedBookings} />
            )}
        </div>
    );
};

const PendingList = ({ bookings, onConfirm }) => {
    if (bookings.length === 0) return (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#aaa' }}>No pending cash payments</h3>
        </div>
    );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.25rem' }}>
            {bookings.map(b => (
                <div key={b._id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>🚘 {b.car?.name || 'Vehicle'}</div>
                            <div style={{ color: '#aaa', fontSize: '0.82rem' }}>{b.occasion}</div>
                        </div>
                        <div style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>PENDING</div>
                    </div>
                    <div style={{ fontSize: '0.83rem', display: 'grid', gap: '4px', marginBottom: '1rem' }}>
                        <div><span style={{ color: '#666' }}>👤 Customer: </span><span style={{ color: '#ccc' }}>{b.customerName || b.user?.name}</span></div>
                        <div><span style={{ color: '#666' }}>📱 Phone: </span><span style={{ color: '#ccc' }}>{b.customerPhone || 'N/A'}</span></div>
                        <div><span style={{ color: '#666' }}>🏠 Address: </span><span style={{ color: '#ccc' }}>{b.customerAddress || 'N/A'}</span></div>
                        <div><span style={{ color: '#666' }}>📅 Date: </span><span style={{ color: '#ccc' }}>{new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} {b.startTime}</span></div>
                        <div><span style={{ color: '#666' }}>Pickup: </span><span style={{ color: '#ccc' }}>{b.pickupLocation}</span></div>
                        <div><span style={{ color: '#666' }}>Drop: </span><span style={{ color: '#ccc' }}>{b.dropoffLocation}</span></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f5b754' }}>₹{b.totalPrice?.toLocaleString('en-IN')}</div>
                        <button
                            onClick={() => onConfirm(b._id)}
                            className="btn-primary"
                            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                        >
                            💵 COLLECT CASH
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CollectedList = ({ bookings }) => {
    if (bookings.length === 0) return (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#aaa' }}>No collected payments yet</h3>
        </div>
    );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.25rem' }}>
            {bookings.map(b => (
                <div key={b._id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                            {b.booking_id && <div style={{ color: '#f5b754', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{b.booking_id}</div>}
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>🚘 {b.car?.name || 'Vehicle'}</div>
                            <div style={{ color: '#aaa', fontSize: '0.82rem' }}>{b.occasion}</div>
                        </div>
                        <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>COLLECTED</div>
                    </div>
                    <div style={{ fontSize: '0.83rem', display: 'grid', gap: '4px', marginBottom: '0.75rem' }}>
                        <div><span style={{ color: '#666' }}>👤 Customer: </span><span style={{ color: '#ccc' }}>{b.customerName || b.user?.name}</span></div>
                        <div><span style={{ color: '#666' }}>📱 Phone: </span><span style={{ color: '#ccc' }}>{b.customerPhone || 'N/A'}</span></div>
                        <div><span style={{ color: '#666' }}>🏠 Address: </span><span style={{ color: '#ccc' }}>{b.customerAddress || 'N/A'}</span></div>
                        <div><span style={{ color: '#666' }}>📅 Date: </span><span style={{ color: '#ccc' }}>{new Date(b.startDate).toLocaleDateString('en-IN')}</span></div>
                        {b.collectedBy && <div><span style={{ color: '#666' }}>Collected by: </span><span style={{ color: '#ccc' }}>{b.collectedBy.name}</span></div>}
                        {b.collectedAt && <div><span style={{ color: '#666' }}>Collected at: </span><span style={{ color: '#ccc' }}>{new Date(b.collectedAt).toLocaleString('en-IN')}</span></div>}
                    </div>
                    <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.3rem' }}>₹{b.totalPrice?.toLocaleString('en-IN')} ✓</div>
                </div>
            ))}
        </div>
    );
};

const bk = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', transition: 'color 0.2s', flexShrink: 0 };

export default AdminCashier;
