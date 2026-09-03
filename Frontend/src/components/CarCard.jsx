import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    return (
        <div className="glass-panel" style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(251, 188, 5, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ height: '200px', backgroundColor: '#333', backgroundImage: `url(${car.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* Image Placeholder */}
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--primary-color)' }}>{car.name}</h3>
                <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '5px' }}>{car.type} • {car.transmission} • {car.seats} Seats</p>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>₹{(car.pricePerDay * 80).toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary-dark)', fontWeight: 'normal' }}>/ day</span></h4>

                <Link to={`/book/${car._id}`} style={{ marginTop: 'auto' }}>
                    <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>Book Now</button>
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
