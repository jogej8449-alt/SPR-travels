import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // { booking }
    const [amountInput, setAmountInput] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState(null);
    const [filter, setFilter] = useState('all'); // all | pending | confirmed

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/bookings');
            setBookings(Array.isArray(data) ? data.reverse() : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const filteredBookings = bookings.filter(b => {
        if (filter === 'pending') return b.paymentStatus === 'PENDING';
        if (filter === 'confirmed') return b.status === 'CONFIRMED';
        return true;
    });

    const openModal = (b) => {
        setModal(b);
        setAmountInput('');
        setConfirmModal(false);
        setMessage(null);
    };

    const handleConfirmCash = async () => {
        if (!modal) return;
        setProcessing(true);
        try {
            const { data } = await axios.post(`/api/cash/${modal._id}/confirm`, { amount_received: Number(amountInput) });
            if (data.success) {
                setMessage({ type: 'success', text: `✅ Cash Collected! Booking ID: ${data.booking?.booking_id}` });
                fetchBookings();
                setTimeout(() => { setModal(null); setConfirmModal(false); }, 2500);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || '❌ Amount mismatch. Cannot confirm.' });
        } finally {
            setProcessing(false);
        }
    };

    const amountMatch = true; // S. Annamayya determines the valid amount manually

    return (
        <div style={{ padding: '2rem 5%', minHeight: '100vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>← Back</button>
                <h1 className="heading text-gradient" style={{ fontSize: '2rem' }}>💵 Cash Collection Management</h1>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Bookings', val: bookings.length, icon: '📋' },
                    { label: 'Cash Pending', val: bookings.filter(b => b.paymentStatus === 'PENDING').length, icon: '⏳', color: '#f5b754' },
                    { label: 'Confirmed', val: bookings.filter(b => b.status === 'CONFIRMED').length, icon: '✅', color: '#10b981' },
                ].map((s, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                        <h2 style={{ color: s.color || 'white', fontSize: '2rem' }}>{s.val}</h2>
                        <p style={{ color: 'var(--text-secondary-dark)', fontSize: '0.9rem' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {['all', 'pending', 'confirmed'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize',
                        background: filter === f ? 'var(--primary-color)' : 'transparent',
                        color: filter === f ? '#000' : '#ccc',
                        border: filter === f ? 'none' : '1px solid var(--glass-border)',
                    }}>{f}</button>
                ))}
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary-dark)', marginTop: '4rem' }}>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                    <h3 style={{ color: 'var(--text-secondary-dark)' }}>No bookings found</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                    {filteredBookings.map(b => (
                        <div key={b._id} className="glass-panel" style={{
                            padding: '1.5rem',
                            borderLeft: b.status === 'CONFIRMED' ? '4px solid #10b981' : '4px solid #f5b754',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>🚘 {b.car?.name || b.carName || 'Kia Carens'}</h3>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                                    background: b.status === 'CONFIRMED' ? 'rgba(16,185,129,0.2)' : 'rgba(245,183,84,0.2)',
                                    color: b.status === 'CONFIRMED' ? '#10b981' : '#f5b754',
                                }}>
                                    {b.status === 'CONFIRMED' ? '✓ CONFIRMED' : '⏳ PENDING'}
                                </span>
                            </div>

                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ccc' }}>👤 {b.customerName || b.user?.name || 'Customer'}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ccc' }}>� {b.customerPhone || 'Not provided'}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#ccc' }}>🏠 {b.customerAddress || 'Not provided'}</p>
                            <p style={{ margin: '8px 0 5px 0', fontSize: '0.9rem', color: '#aaa' }}>�📍 {b.pickupLocation} → {b.dropoffLocation}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#aaa' }}>📅 {new Date(b.startDate).toLocaleDateString('en-IN')}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary-dark)' }}>Amount Due</p>
                                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>₹{b.totalPrice?.toLocaleString('en-IN')}</h2>
                                </div>
                                {b.paymentStatus === 'PENDING' ? (
                                    <button
                                        onClick={() => openModal(b)}
                                        style={{
                                            background: 'var(--primary-color)', color: '#000',
                                            border: 'none', padding: '10px 20px', borderRadius: '8px',
                                            cursor: 'pointer', fontWeight: 'bold',
                                        }}>
                                        💵 RECEIVE CASH
                                    </button>
                                ) : (
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>CASH ✓ PAID</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CASH COLLECTION MODAL */}
            {modal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '1rem',
                }}>
                    <div className="glass-panel" style={{ padding: '3rem', maxWidth: '480px', width: '100%', position: 'relative' }}>
                        <button onClick={() => setModal(null)} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'transparent', color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem' }}>💵</div>
                            <h2 style={{ color: 'var(--primary-color)' }}>CASH COLLECTION</h2>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <p><b>Customer:</b> {modal.customerName || modal.user?.name || 'Customer'}</p>
                            <p><b>Phone:</b> {modal.customerPhone || 'N/A'}</p>
                            <p><b>Vehicle:</b> {modal.car?.name || modal.carName}</p>
                            <p><b>Pickup:</b> {modal.pickupLocation}</p>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><b>Estimated Total (Optional):</b> <span style={{ color: 'var(--primary-color)' }}>₹{modal.totalPrice?.toLocaleString('en-IN')}</span></p>
                        </div>

                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Amount Received (₹)</label>
                        <input
                            type="number"
                            value={amountInput}
                            onChange={e => setAmountInput(e.target.value)}
                            placeholder="Enter exact amount received..."
                            style={{
                                width: '100%', padding: '14px', borderRadius: '8px', fontSize: '1.3rem',
                                background: 'rgba(255,255,255,0.07)', color: 'white',
                                border: amountInput ? (amountMatch ? '2px solid #10b981' : '2px solid #ef4444') : '1px solid var(--glass-border)',
                                outline: 'none',
                            }}
                        />

                        {amountInput && (
                            <p style={{ marginTop: '8px', fontWeight: '600', color: '#10b981' }}>
                                ✓ Ready to Confirm Cash Received
                            </p>
                        )}

                        {message && (
                            <div style={{ marginTop: '1rem', padding: '10px', borderRadius: '8px', background: message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                {message.text}
                            </div>
                        )}

                        {!confirmModal ? (
                            <button
                                onClick={() => setConfirmModal(true)}
                                disabled={!amountMatch}
                                style={{
                                    marginTop: '2rem', width: '100%', padding: '15px',
                                    background: amountMatch ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                    color: amountMatch ? '#000' : '#ccc',
                                    border: 'none', borderRadius: '8px', cursor: amountMatch ? 'pointer' : 'not-allowed',
                                    fontWeight: 'bold', fontSize: '1rem',
                                }}>
                                ✓ CONFIRM CASH PAYMENT
                            </button>
                        ) : (
                            <div style={{ marginTop: '2rem', background: 'rgba(245,183,84,0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(245,183,84,0.3)' }}>
                                <p style={{ fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                                    Are you sure you received <b style={{ color: 'var(--primary-color)' }}>₹{Number(amountInput).toLocaleString('en-IN')}</b> cash from {modal.customerName}?
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setConfirmModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #ccc', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>CANCEL</button>
                                    <button onClick={handleConfirmCash} disabled={processing} style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        {processing ? 'Processing...' : '✓ CONFIRM'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
