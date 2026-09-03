import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCars = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            const { data } = await axios.get('/api/cars');
            setCars(data);
        };
        fetchCars();
    }, []);

    const toggleAvailability = async (id, currentStatus) => {
        // Implement backend status updates
    };

    return (
        <div style={{ padding: '3rem 5%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="heading text-gradient">Vehicle Management</h1>
                <button className="btn-primary" style={{ padding: '10px 20px' }}>+ Add New Vehicle</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Vehicle Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Base Price</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <img src={c.imageUrl} alt={c.name} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
                                <td style={{ padding: '1rem' }}>{c.type}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: c.isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: c.isAvailable ? '#10b981' : '#ef4444',
                                        borderRadius: '20px', fontSize: '0.8rem'
                                    }}>
                                        {c.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>₹{c.pricePerDay || c.pricePerHour}/day</td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'transparent', color: 'var(--primary-color)', border: 'none', cursor: 'pointer', marginRight: '1rem' }}>Edit</button>
                                    <button style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCars;
