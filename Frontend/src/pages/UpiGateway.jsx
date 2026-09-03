import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';

const UpiGateway = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [status, setStatus] = useState('processing');
    const { method, amount, bookingData } = location.state || {};

    // Dynamic brand theming for ultimate wow factor
    const themes = {
        phonepe: { name: 'PhonePe', color: '#5f259f', logo: '₹' },
        gpay: { name: 'Google Pay', color: '#ffffff', textColor: '#3c4043', logo: 'G' },
        paytm: { name: 'Paytm', color: '#002970', logo: 'P' },
        bank: { name: 'Secure Bank Transfer', color: '#1a1a1a', logo: '🏛' }
    };

    const currentTheme = themes[method] || themes.phonepe;

    useEffect(() => {
        if (!bookingData) {
            navigate('/');
            return;
        }

        // Simulate network payment processing duration (3 seconds)
        const processPayment = async () => {
            try {
                // Actually save the booking to the backend!
                await createBooking(bookingData, user?.token);

                setTimeout(() => {
                    setStatus('success');
                    // Automatically redirect to MyBookings after 2 seconds showing Success screen
                    setTimeout(() => {
                        navigate('/mybookings');
                    }, 2000);
                }, 3000);

            } catch (error) {
                console.error("Payment API Error:", error);
                setStatus('failed');
            }
        };

        processPayment();
    }, [bookingData, navigate, user]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: currentTheme.color,
            color: currentTheme.textColor || 'white',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, transition: 'all 0.5s ease'
        }}>
            {status === 'processing' && (
                <div style={{ textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem',
                        fontSize: '2.5rem', fontWeight: 'bold'
                    }}>
                        {currentTheme.logo}
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{currentTheme.name}</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Securely processing payment of</p>
                    <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>₹{amount?.toLocaleString('en-IN')}</h1>
                    <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>Please do not close this window or press back...</p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ textAlign: 'center', backgroundColor: '#10b981', padding: '4rem', borderRadius: '20px', color: 'white', transform: 'scale(1.1)', transition: 'transform 0.5s' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✓</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.2rem' }}>₹{amount?.toLocaleString('en-IN')} paid via {currentTheme.name}</p>
                    <p style={{ marginTop: '1rem', opacity: 0.8 }}>Redirecting to your bookings...</p>
                </div>
            )}

            {status === 'failed' && (
                <div style={{ textAlign: 'center', backgroundColor: '#ef4444', padding: '3rem', borderRadius: '20px', color: 'white' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✕</div>
                    <h2>Payment Failed</h2>
                    <p>There was an error communicating with the bank.</p>
                    <button onClick={() => navigate(-1)} style={{ marginTop: '2rem', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default UpiGateway;
