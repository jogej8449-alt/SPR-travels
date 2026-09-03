import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                // Hitting the backend to get the exact car data they clicked
                const { data } = await axios.get(`/api/cars/${id}`);
                setCar(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching car:", error);
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '5rem', color: 'white' }}>Loading Car Details...</h2>;
    if (!car) return <h2 style={{ textAlign: 'center', marginTop: '5rem', color: 'red' }}>Car not found!</h2>;

    return (
        <div style={{ padding: '3rem 5%' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{
                    flex: '1 1 400px',
                    height: '350px',
                    backgroundColor: '#111',
                    backgroundImage: `url(${car.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)'
                }}>
                </div>
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                    <h2 className="heading text-gradient" style={{ marginBottom: '10px', fontSize: '2.5rem' }}>{car.name}</h2>
                    <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '20px', lineHeight: '1.6' }}>
                        {car.description || "Detailed description of the luxury vehicle, including top-of-the-line performance, lavish seating, and exclusive premium features designed for optimal comfort."}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '30px' }}>
                        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Type: {car.type}</div>
                        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Seats: {car.seats}</div>
                        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Transmission: {car.transmission}</div>
                        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Fuel: {car.fuelType}</div>
                    </div>
                    <h3 style={{ fontSize: '2rem', marginTop: 'auto', color: 'white' }}>
                        ₹{(car.pricePerDay * 80).toLocaleString('en-IN')} <span style={{ fontSize: '1rem', color: 'var(--text-secondary-dark)', fontWeight: 'normal' }}>/ day</span>
                    </h3>
                </div>
            </div>

            {/* We pass the LIVE database car object straight to the Booking Form so prices match perfectly! */}
            <BookingForm car={car} />
        </div>
    );
};

export default CarDetails;
