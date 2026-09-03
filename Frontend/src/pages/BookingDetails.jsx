import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState(null);

    const submitFeedback = () => {
        setFeedbackSubmitStatus('submitting');
        axios.post(`/api/bookings/${id}/feedback`, { rating, comment })
            .then(res => {
                setFeedbackSubmitStatus('success');
                setBooking(prev => ({ ...prev, driverFeedback: res.data.feedback }));
            })
            .catch(err => {
                setFeedbackSubmitStatus('error');
                alert(err.response?.data?.message || 'Failed to submit feedback');
            });
    };

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        axios.get(`/api/bookings/${id}`)
            .then(res => { setBooking(res.data.booking); setLoading(false); })
            .catch(err => { setError(err.response?.data?.message || 'Booking not found'); setLoading(false); });
    }, [id, user, navigate]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem 5%', color: '#aaa' }}>⏳ Loading booking details...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '5rem 5%', color: '#ef4444' }}>❌ {error}</div>;
    if (!booking) return null;

    const isConfirmed = booking.status === 'CONFIRMED';

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '750px', margin: '0 auto' }}>
            <button onClick={() => navigate('/mybookings')} style={bk}>← Back to History</button>

            <h1 className="heading text-gradient" style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', marginBottom: '0.25rem' }}>
                Booking Details
            </h1>
            {booking.booking_id && (
                <p style={{ color: '#f5b754', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                    {booking.booking_id}
                </p>
            )}

            {/* Status Banner */}
            <div style={{
                padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '1.5rem',
                background: isConfirmed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                border: `1px solid ${isConfirmed ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                display: 'flex', gap: '1rem', alignItems: 'center'
            }}>
                <div style={{ fontSize: '1.5rem' }}>{isConfirmed ? '✅' : '⏳'}</div>
                <div>
                    <div style={{ fontWeight: 700, color: isConfirmed ? '#10b981' : '#f59e0b' }}>
                        {booking.status === 'WAITING_FOR_CASH' ? 'Waiting for Cash' : booking.status}
                    </div>
                    <div style={{ color: '#aaa', fontSize: '0.82rem' }}>
                        Payment: {booking.paymentStatus === 'COLLECTED' ? '💵 Cash Received ✓' : '⏳ Awaiting Cash'}
                    </div>
                </div>
            </div>

            {/* Locations */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={sh}>📍 Locations</h3>
                <Detail label="Pickup" value={booking.pickupLocation} />
                <Detail label="Drop" value={booking.dropoffLocation} />
                {booking.estimatedDistance && <Detail label="Est. Distance" value={`${booking.estimatedDistance} km`} />}
            </div>

            {/* Trip Details */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={sh}>🚘 Trip Details</h3>
                <Detail label="Vehicle" value={booking.car?.name || booking.carName} />
                <Detail label="Seats" value={booking.car?.seats} />
                <Detail label="Event" value={booking.occasion} />
                <Detail label="Date" value={booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
                <Detail label="Time" value={booking.startTime || '—'} />
                <Detail label="Duration" value={`${booking.duration} Hours`} />
                <Detail label="Passengers" value={booking.passengers} />
                {booking.decorationType && booking.decorationType !== 'none' && <Detail label="Decoration" value={booking.decorationType} />}
                {booking.driver && <Detail label="Driver" value={booking.driver.name} />}
            </div>

            {/* Price Breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderTop: '2px solid rgba(245,183,84,0.3)' }}>
                <h3 style={sh}>💰 Price Breakdown</h3>
                <PriceDetail label="Base Package" amount={booking.baseAmount} />
                {booking.extraHoursAmount > 0 && <PriceDetail label="Extra Hours" amount={booking.extraHoursAmount} />}
                {booking.extraKmAmount > 0 && <PriceDetail label="Extra KM" amount={booking.extraKmAmount} />}
                {booking.decorationAmount > 0 && <PriceDetail label="Decoration" amount={booking.decorationAmount} />}
                {booking.taxAmount > 0 && <PriceDetail label="Tax" amount={booking.taxAmount} />}
                {booking.discountAmount > 0 && <PriceDetail label="Discount" amount={-booking.discountAmount} negative />}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>TOTAL</span>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#f5b754' }}>₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ marginTop: '0.75rem', color: booking.paymentStatus === 'COLLECTED' ? '#10b981' : '#f59e0b', fontWeight: 600, fontSize: '0.88rem' }}>
                    {booking.paymentStatus === 'COLLECTED' ? '✓ Cash Received' : '⏳ Cash Pending'}
                    {booking.collectedBy && ` – Collected by ${booking.collectedBy.name || 'Cashier'}`}
                </div>
            </div>

            {/* Driver Feedback Panel */}
            {isConfirmed && booking.driver && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderTop: '2px solid rgba(16,185,129,0.3)' }}>
                    <h3 style={sh}>⭐ Driver Feedback</h3>
                    {booking.driverFeedback?.rating ? (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ color: '#f5b754', fontSize: '1.2rem', marginBottom: '8px' }}>
                                {'★'.repeat(booking.driverFeedback.rating)}{'☆'.repeat(5 - booking.driverFeedback.rating)}
                            </div>
                            <p style={{ color: '#ccc', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>"{booking.driverFeedback.comment}"</p>
                            <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '10px' }}>Submitted on {new Date(booking.driverFeedback.submittedAt).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '5px', fontSize: '2rem', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? '#f5b754' : '#555', transition: 'color 0.2s' }}>★</span>
                                ))}
                            </div>
                            <textarea
                                value={comment} onChange={e => setComment(e.target.value)}
                                placeholder="How was your trip? Leave a review for the driver..."
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '80px', fontFamily: 'inherit' }}
                            />
                            <button onClick={submitFeedback} disabled={feedbackSubmitStatus === 'submitting'} style={{ background: 'var(--primary-color)', color: 'black', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s opacity' }}>
                                {feedbackSubmitStatus === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {booking.paymentStatus === 'COLLECTED' && (
                    <button className="btn-primary" onClick={() => navigate(`/receipt/${booking._id}`)} style={{ padding: '12px 24px' }}>
                        📄 DOWNLOAD RECEIPT
                    </button>
                )}
                <button onClick={() => navigate('/mybookings')} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    ← History
                </button>
            </div>
        </div>
    );
};

const bk = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', transition: 'color 0.2s' };
const sh = { color: '#f5b754', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' };

function Detail({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: '#666', fontSize: '0.85rem', minWidth: '110px', flexShrink: 0 }}>{label}</span>
            <span style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 500 }}>{value || '—'}</span>
        </div>
    );
}

function PriceDetail({ label, amount, negative }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.88rem' }}>
            <span style={{ color: '#aaa' }}>{label}</span>
            <span style={{ color: negative ? '#ef4444' : '#fff', fontWeight: 600 }}>₹{Math.abs(amount).toLocaleString('en-IN')}</span>
        </div>
    );
}

export default BookingDetails;
