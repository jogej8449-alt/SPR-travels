import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const booking = location.state?.booking;

    return (
        <div style={{ padding: '8rem 5%', textAlign: 'center' }}>
            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', borderTop: '4px solid #f5b754' }}>
                <h1 className="heading text-gradient" style={{ marginBottom: '1rem' }}>🎉 Booking Request Submitted</h1>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px', textAlign: 'left', marginBottom: '2rem' }}>
                    <p><b>Booking ID:</b> {booking?._id || 'RR-PENDING'}</p>
                    <p><b>Vehicle:</b> {booking?.carName || 'Luxury Vehicle'}</p>
                    <p><b>Pickup:</b> {booking?.pickupLocation || 'Pending'}</p>
                    <p><b>Drop:</b> {booking?.dropoffLocation || 'Pending'}</p>
                    <p><b>Amount:</b> ₹{booking?.totalPrice?.toLocaleString('en-IN')}</p>
                    <p><b>Payment Method:</b> 💵 Offline Cash</p>
                    <p><b>Payment Status:</b> <span style={{ color: '#f5b754' }}>⏳ Pending</span></p>
                </div>

                {booking?.cashCollectionOTP && (
                    <div style={{ background: '#10b981', color: '#000', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Your Cash Collection OTP</h4>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '10px' }}>{booking.cashCollectionOTP}</div>
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>Please provide this securely to the driver when handing over the cash.</p>
                    </div>
                )}

                <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '3rem' }}>
                    "Please pay the amount in cash to your assigned driver during pickup."
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/mybookings">
                        <button className="btn-primary" style={{ padding: '12px 24px' }}>View My Bookings</button>
                    </Link>
                    <Link to={`/receipt/${booking?._id || 'temp'}`}>
                        <button style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '30px', cursor: 'pointer' }}>
                            View E-Receipt
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
