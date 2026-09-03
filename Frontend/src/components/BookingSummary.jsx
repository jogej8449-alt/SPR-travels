const BookingSummary = ({ bookingDetails }) => {
    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Booking Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary-dark)' }}>Car Rental:</span>
                    <span>${bookingDetails?.carPrice || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary-dark)' }}>Driver Fee:</span>
                    <span>${bookingDetails?.driverFee || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary-dark)' }}>Duration:</span>
                    <span>{bookingDetails?.days || 0} Days</span>
                </div>
                <hr style={{ borderColor: 'var(--glass-border)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span className="text-gradient">${bookingDetails?.total || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;
