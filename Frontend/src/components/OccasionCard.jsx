const OccasionCard = ({ occasion, description, image }) => {
    return (
        <div className="glass-panel" style={{
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            textAlign: 'center'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{ height: '180px', backgroundColor: '#333', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '10px' }}>{occasion}</h3>
                <p style={{ color: 'var(--text-secondary-dark)' }}>{description}</p>
            </div>
        </div>
    );
};

export default OccasionCard;
