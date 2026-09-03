import React from 'react';

const ContactSupport = () => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            marginTop: '3rem',
            marginBottom: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: '650px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <h4 style={{ color: '#f5b754', marginBottom: '1rem', fontSize: '1.1rem', letterSpacing: '1px' }}>
                📞 NEED HELP WITH BOOKING?
            </h4>
            <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                "For any booking enquiries or assistance,<br />please contact us."
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <a href="tel:8639737339" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📞 CALL 8639737339
                    </button>
                </a>
                <a href="tel:9346184719" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📞 CALL 9346184719
                    </button>
                </a>
            </div>

            <div style={{ color: '#666', fontSize: '0.8rem', textAlign: 'left', maxWidth: '400px', margin: '0 auto', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <p style={{ marginBottom: '8px', color: '#888', fontWeight: 600 }}>These numbers are ONLY for:</p>
                <ul style={{ margin: 0, paddingLeft: '20px', marginBottom: '12px' }}>
                    <li>Booking enquiries</li>
                    <li>Vehicle rental enquiries</li>
                    <li>Customer assistance</li>
                    <li>General support</li>
                </ul>
                <p style={{ marginBottom: '8px', color: '#ef4444', opacity: 0.8, fontWeight: 600 }}>DO NOT use these numbers for:</p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#dd5555' }}>
                    <li>OTP</li>
                    <li>SMS verification</li>
                    <li>Digital payments</li>
                    <li>Payment confirmation</li>
                    <li>Automatic booking confirmation</li>
                </ul>
            </div>
        </div>
    );
};

export default ContactSupport;
