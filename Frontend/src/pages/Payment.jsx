import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const bookingData = location.state?.bookingData;

    const [loading, setLoading] = useState(false);

    if (!bookingData) {
        return <div style={{ padding: '5rem', textAlign: 'center', color: 'white' }}>No booking found. Please go back to Cars.</div>;
    }

    const handleCashConfirmation = async () => {
        try {
            setLoading(true);

            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Initiate Booking directly as Cash Payment Pending
            const { data } = await axios.post('/api/payment/cash-checkout', { bookingData }, config);

            if (data.success) {
                navigate('/payment-success', { state: { booking: data.booking } });
            } else {
                setLoading(false);
                alert("Error reserving booking.");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Could not complete booking process.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 5%' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem' }}>
                <h2 className="heading text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Booking Summary</h2>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--primary-color)', margin: '0 0 10px 0' }}>Vehicle: {bookingData.carName || "Select Vehicle"}</h3>
                    <p style={{ color: 'var(--text-secondary-dark)', margin: '0' }}>Pickup: {bookingData.pickupLocation}</p>
                    <p style={{ color: 'var(--text-secondary-dark)', margin: '0 0 10px 0' }}>Drop: {bookingData.dropoffLocation}</p>
                    <p style={{ color: 'var(--text-secondary-dark)', margin: '0' }}>Duration: {bookingData.duration} Hours</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                    <h4 style={{ color: 'white', marginBottom: '1rem' }}>Payment Method</h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', padding: '10px', border: '1px solid #10b981', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <input type="radio" checked readOnly style={{ accentColor: '#10b981' }} />
                        <span style={{ fontWeight: 'bold' }}>Offline Cash Payment</span>
                    </label>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '10px' }}>* Please pay the rental amount in cash to the driver/admin during pickup.</p>
                </div>

                <h3 style={{ textAlign: 'center', color: 'white', marginBottom: '2rem', fontSize: '2.5rem' }}>₹{bookingData.totalPrice.toLocaleString('en-IN')}</h3>

                <button
                    onClick={handleCashConfirmation}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold', background: '#10b981', color: '#000', border: 'none' }}
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default Payment;
