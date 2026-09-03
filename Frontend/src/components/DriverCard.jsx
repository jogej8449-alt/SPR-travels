const DriverCard = ({ driver }) => {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#444',
                backgroundImage: `url(${driver?.imageUrl || ''})`, backgroundSize: 'cover', backgroundPosition: 'center'
            }}></div>
            <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{driver?.name || 'Professional Driver'}</h3>
                <p style={{ color: 'var(--text-secondary-dark)', fontSize: '0.9rem' }}>Experience: {driver?.experienceYears || 5} Years</p>
                <p style={{ color: 'var(--text-secondary-dark)', fontSize: '0.9rem' }}>Languages: {driver?.languages?.join(', ') || 'English'}</p>
                <p style={{ fontWeight: 600, marginTop: '5px' }}>${driver?.pricePerDay || 50} / day</p>
            </div>
        </div>
    );
};

export default DriverCard;
