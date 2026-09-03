import { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                // Fetch the live fleet from the MongoDB Database!
                const { data } = await axios.get('/api/cars');
                setCars(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <div style={{ padding: '3rem 5%' }}>
            <h1 className="heading text-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>Our Premium Fleet</h1>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary-dark)', fontSize: '1.5rem', animation: 'pulse 1.5s infinite' }}>
                    Loading luxury vehicles from our garages...
                </div>
            ) : cars.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'white' }}>No cars currently available.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {cars.map(car => (
                        <CarCard key={car._id} car={car} />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Cars;
