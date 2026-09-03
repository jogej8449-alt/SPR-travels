import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Receipt = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        axios.get(`/api/bookings/${id}`)
            .then(res => { setBooking(res.data.booking); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id, user, navigate]);

    const handlePrint = () => window.print();

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#aaa' }}>⏳ Loading receipt...</div>;
    if (!booking) return <div style={{ textAlign: 'center', padding: '5rem', color: '#ef4444' }}>Receipt not found.</div>;

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate(`/mybookings/${booking._id}`)} style={bk}>← Back</button>
                <button onClick={handlePrint} style={{ marginLeft: 'auto', padding: '10px 22px', background: 'linear-gradient(135deg,#f5b754,#e8920a)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                    🖨️ Print / Save PDF
                </button>
            </div>

            {/* Receipt Card */}
            <div id="receipt-print" style={{ background: '#0d1a30', border: '1px solid rgba(245,183,84,0.3)', borderRadius: '16px', padding: '2.5rem', borderTop: '4px solid #f5b754' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚗</div>
                    <h1 className="text-gradient" style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.5px' }}>RIDE RENT</h1>
                    <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '4px' }}>Vehicle Rental for Every Occasion</p>
                    <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.88rem', marginTop: '0.75rem' }}>✓ OFFICIAL RECEIPT</p>
                </div>

                {/* Booking ID */}
                {booking.booking_id && (
                    <div style={{ textAlign: 'center', background: 'rgba(245,183,84,0.07)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ color: '#aaa', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Booking ID</div>
                        <div style={{ color: '#f5b754', fontFamily: 'monospace', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '2px' }}>{booking.booking_id}</div>
                    </div>
                )}

                {/* Customer & Booking Info */}
                <div style={{ display: 'grid', gap: '8px', marginBottom: '1.5rem' }}>
                    <RRow label="Customer" value={booking.user?.name || 'N/A'} />
                    <RRow label="Vehicle" value={booking.car?.name || booking.carName} />
                    <RRow label="Event" value={booking.occasion} />
                    <RRow label="Date" value={booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
                    <RRow label="Time" value={booking.startTime || '—'} />
                    <RRow label="Duration" value={`${booking.duration} Hours`} />
                    <RRow label="Passengers" value={booking.passengers} />
                    {booking.decorationType && booking.decorationType !== 'none' && <RRow label="Decoration" value={booking.decorationType} />}
                </div>

                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem' }}>
                    <RRow label="📍 Pickup" value={booking.pickupLocation} />
                    <RRow label="📍 Drop" value={booking.dropoffLocation} />
                    {booking.estimatedDistance && <RRow label="Est. Distance" value={`${booking.estimatedDistance} km`} />}
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                    <h4 style={{ color: '#f5b754', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>Price Breakdown</h4>
                    <PRow label="Base Package" amount={booking.baseAmount} />
                    {booking.extraHoursAmount > 0 && <PRow label="Extra Hours" amount={booking.extraHoursAmount} />}
                    {booking.extraKmAmount > 0 && <PRow label="Extra KM" amount={booking.extraKmAmount} />}
                    {booking.decorationAmount > 0 && <PRow label="Decoration" amount={booking.decorationAmount} />}
                    {booking.taxAmount > 0 && <PRow label="Tax" amount={booking.taxAmount} />}
                    {booking.discountAmount > 0 && <PRow label="Discount" amount={-booking.discountAmount} />}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>TOTAL</span>
                        <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#f5b754' }}>₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', display: 'grid', gap: '6px' }}>
                    <RRow label="Payment Method" value="OFFLINE CASH" />
                    <RRow label="Payment Status" value={booking.paymentStatus === 'COLLECTED' ? 'PAID ✓' : 'PENDING'} />
                    {booking.collectedBy && <RRow label="Collected By" value={booking.collectedBy.name || 'Cashier'} />}
                    {booking.collectedAt && <RRow label="Collected At" value={new Date(booking.collectedAt).toLocaleString('en-IN')} />}
                    <RRow label="Booking Status" value={booking.status} />
                </div>

                <div style={{ textAlign: 'center', color: '#555', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                    Thank you for choosing SPR RIDES · Vehicle Rental for Every Occasion
                </div>
            </div>
        </div>
    );
};

const bk = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', transition: 'color 0.2s' };

function RRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '3px 0', fontSize: '0.85rem' }}>
            <span style={{ color: '#555', flexShrink: 0 }}>{label}</span>
            <span style={{ color: '#ddd', fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{value || '—'}</span>
        </div>
    );
}

function PRow({ label, amount }) {
    const neg = amount < 0;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '0.85rem' }}>
            <span style={{ color: '#aaa' }}>{label}</span>
            <span style={{ color: neg ? '#ef4444' : '#fff', fontWeight: 600 }}>₹{Math.abs(amount).toLocaleString('en-IN')}</span>
        </div>
    );
}

export default Receipt;
