import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        bookings: 0,
        revenue: 0,
        cars: 0,
        pending: 0
    });
    const [fleet, setFleet] = useState([]);

    useEffect(() => {
        const fetchAdvancedStats = async () => {
            if (!user || !user.token) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                };
                const [dashRes, carsRes] = await Promise.all([
                    axios.get('/api/admin/dashboard', config),
                    axios.get('/api/cars')
                ]);

                setStats({
                    bookings: dashRes.data.totalBookings || 0,
                    revenue: dashRes.data.totalRevenue || 0,
                    cars: dashRes.data.activeFleet || 0,
                    pending: dashRes.data.pendingApprovals || 0
                });

                if (Array.isArray(carsRes.data)) {
                    setFleet(carsRes.data);
                }
            } catch (e) {
                console.error("Failed to fetch dashboard stats", e);
            }
        };
        fetchAdvancedStats();
    }, [user]);

    return (
        <div style={{ padding: '3rem 5%' }}>

            {/* ── Back Button ── */}
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s', padding: 0 }}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = '#aaa'}
                >
                    ← Back to Public Dashboard
                </button>
            </div>

            <h1 className="heading text-gradient" style={{ marginBottom: '2rem' }}>Administrative Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

                {/* ── Left Side: Stats ── */}
                <div>
                    <h2 className="heading" style={{ marginBottom: '1.5rem', fontSize: '1.8rem', color: '#fff' }}>Overview</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--primary-color)' }}>
                            <h3 style={{ color: 'var(--text-secondary-dark)', fontSize: '1rem' }}>Total Bookings</h3>
                            <p style={{ fontSize: '2.5rem', color: 'white', margin: '0.5rem 0' }}>{stats.bookings}</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #10b981' }}>
                            <h3 style={{ color: 'var(--text-secondary-dark)', fontSize: '1rem' }}>Total Revenue</h3>
                            <p style={{ fontSize: '2.5rem', color: 'white', margin: '0.5rem 0' }}>₹{stats.revenue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #3b82f6' }}>
                            <h3 style={{ color: 'var(--text-secondary-dark)', fontSize: '1rem' }}>Active Fleet</h3>
                            <p style={{ fontSize: '2.5rem', color: 'white', margin: '0.5rem 0' }}>{stats.cars}</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #ef4444' }}>
                            <h3 style={{ color: 'var(--text-secondary-dark)', fontSize: '1rem' }}>Pending Approvals</h3>
                            <p style={{ fontSize: '2.5rem', color: 'white', margin: '0.5rem 0' }}>{stats.pending}</p>
                        </div>
                    </div>
                </div>

                {/* ── Right Side: Active Fleet Gallery ── */}
                <div>
                    <h2 className="heading text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Active Fleet View</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        {fleet.map(car => (
                            <div key={car._id} className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                                <div style={{
                                    width: '100%',
                                    height: '280px',
                                    background: `url(${car.imageUrl}) center/cover no-repeat`,
                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }} />
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{car.name}</h3>
                                        {car.registrationNumber && (
                                            <span style={{ background: 'var(--primary-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                {car.registrationNumber}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary-dark)', marginTop: '0.5rem', marginBottom: 0 }}>
                                        {car.type} • {car.transmission}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
