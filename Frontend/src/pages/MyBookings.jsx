import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const statusColor = (status) => {
    if (status === 'CONFIRMED') return '#10b981';
    if (status === 'WAITING_FOR_CASH') return '#f59e0b';
    if (status === 'CANCELLED') return '#ef4444';
    return '#a0aec0';
};

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        axios.get('/api/bookings/my')
            .then(res => { setBookings(res.data.bookings || []); setLoading(false); })
            .catch(err => { setError(err.response?.data?.message || 'Failed to load bookings'); setLoading(false); });
    }, [user, navigate]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '5rem 5%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#aaa' }}>Loading booking history...</p>
        </div>
    );

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
                <div>
                    <h1 className="heading text-gradient" style={{ margin: 0, fontSize: 'clamp(1.5rem,4vw,2rem)' }}>
                        📋 Booking History
                    </h1>
                    <p style={{ color: '#666', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Your ride history from MongoDB</p>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1rem', color: '#ef4444', marginBottom: '1.5rem' }}>
                    ❌ {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚘</div>
                    <h3 style={{ color: '#aaa', marginBottom: '0.75rem' }}>No bookings yet</h3>
                    <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Your confirmed rides will appear here.</p>
                    <Link to="/booking">
                        <button className="btn-primary" style={{ padding: '12px 28px' }}>🚗 Book Now</button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(350px,1fr))', gap: '1.5rem' }}>
                    {bookings.map(b => (
                        <div
                            key={b._id}
                            className="glass-panel"
                            style={{ padding: '1.5rem', borderLeft: `4px solid ${statusColor(b.status)}`, transition: 'transform 0.2s' }}
                        >
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                                        🚘 {b.car?.name || b.carName || 'Vehicle'}
                                    </div>
                                    <div style={{ color: '#555', fontSize: '0.78rem', marginTop: '3px' }}>{b.occasion}</div>
                                </div>
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                                    background: `${statusColor(b.status)}20`, color: statusColor(b.status), letterSpacing: '0.5px'
                                }}>
                                    {b.status === 'CONFIRMED' ? '✓ CONFIRMED' : b.status === 'WAITING_FOR_CASH' ? '⏳ PENDING CASH' : b.status}
                                </span>
                            </div>

                            {/* Booking ID */}
                            {b.booking_id && (
                                <div style={{ background: 'rgba(245,183,84,0.06)', border: '1px solid rgba(245,183,84,0.2)', borderRadius: '8px', padding: '8px 12px', marginBottom: '1rem' }}>
                                    <div style={{ color: '#f5b754', fontWeight: 800, fontFamily: 'monospace', fontSize: '1.05rem', letterSpacing: '1px' }}>{b.booking_id}</div>
                                    <div style={{ color: '#555', fontSize: '0.72rem' }}>Booking ID</div>
                                </div>
                            )}

                            {/* Details */}
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <BookingRow icon="📅" label="Date" value={b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
                                <BookingRow icon="🕐" label="Time" value={b.startTime || '—'} />
                                <BookingRow icon="📍" label="Pickup" value={b.pickupLocation} />
                                <BookingRow icon="↓" label="Drop" value={b.dropoffLocation} />
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '1rem 0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: '#aaa', fontSize: '0.78rem' }}>Payment</div>
                                    <div style={{ color: b.paymentStatus === 'COLLECTED' ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '0.88rem' }}>
                                        💵 CASH {b.paymentStatus === 'COLLECTED' ? '✓ PAID' : '⏳ PENDING'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#aaa', fontSize: '0.78rem' }}>Total</div>
                                    <div style={{ color: '#f5b754', fontWeight: 800, fontSize: '1.2rem' }}>₹{b.totalPrice?.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <Link to={`/mybookings/${b._id}`}>
                                <button style={{ width: '100%', padding: '10px', background: 'transparent', color: '#f5b754', border: '1px solid rgba(245,183,84,0.35)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s' }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,183,84,0.1)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    VIEW DETAILS →
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const backBtn = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s', padding: '4px 0', flexShrink: 0 };

function BookingRow({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.83rem' }}>
            <span style={{ color: '#555', minWidth: '16px' }}>{icon}</span>
            <span style={{ color: '#666', minWidth: '45px', flexShrink: 0 }}>{label}:</span>
            <span style={{ color: '#ccc', wordBreak: 'break-word', flex: 1 }}>{value}</span>
        </div>
    );
}

export default MyBookings;
