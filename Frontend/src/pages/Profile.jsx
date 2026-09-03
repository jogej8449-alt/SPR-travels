import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { logout as logoutService } from '../services/authService';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const formatName = (name) => name?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    useEffect(() => {
        if (user && (user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya'))) {
            setLoadingFeedback(true);
            axios.get(`/api/bookings/driver/feedback?driverName=${user.name}`)
                .then(res => {
                    setFeedbacks(res.data.feedback || []);
                    setLoadingFeedback(false);
                })
                .catch(err => {
                    console.error('Failed to load feedback', err);
                    setLoadingFeedback(false);
                });
        }
    }, [user]);

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    const handleLogout = () => {
        logoutService();
        setUser(null);
        navigate('/');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '1rem' }}>← Back</button>
                <h2 className="heading text-gradient" style={{ margin: 0 }}>My Profile</h2>
            </div>

            <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                {/* Unified Horizontal Profile Card */}
                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'center', flexWrap: 'wrap-reverse' }}>

                        {/* Profile Info (Left Side) */}
                        <div style={{ flex: 1, minWidth: '320px' }}>
                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '1.4rem' }}>Account Information</h3>
                            <div style={{ display: 'grid', gap: '1.2rem', textAlign: 'left' }}>
                                {[
                                    { icon: '👤', label: 'Full Name', val: formatName(user.name) },
                                    ...(user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya')
                                        ? [{ icon: '🏆', label: 'Experience', val: '27 Years Professional Driver' }] : []),
                                    { icon: '☎️', label: 'Phone', val: user.phone || '+91 8639737339' },
                                    { icon: '✉️', label: 'Email', val: user.email },
                                    { icon: '🏅', label: 'Role', val: user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya') ? 'Driver' : (user.role || 'user') },
                                ].map(({ icon, label, val }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                                        <span style={{ fontSize: '1.5rem', minWidth: '32px' }}>{icon}</span>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary-dark)', fontSize: '0.8rem', margin: 0 }}>{label}</p>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Avatar & Name (Right Side) */}
                        <div style={{ flex: '0 0 280px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya') ? (
                                <img
                                    src="/images/daddy.png"
                                    alt="S. Annamayya"
                                    style={{
                                        width: '150px', height: '150px', borderRadius: '50%',
                                        objectFit: 'cover', margin: '0 auto 1.5rem auto',
                                        border: '4px solid var(--primary-color)',
                                        boxShadow: '0 0 20px rgba(245,183,84,0.4)',
                                        display: 'block'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '150px', height: '150px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary-color), #ff8c00)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '4rem', fontWeight: 'bold', color: '#000',
                                    margin: '0 auto 1.5rem auto',
                                }}>
                                    {user.name?.[0]?.toUpperCase() || '👤'}
                                </div>
                            )}
                            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.75rem 0', textTransform: 'capitalize' }}>{formatName(user.name)}</h2>
                            <span style={{
                                background: 'rgba(245,183,84,0.2)', color: 'var(--primary-color)',
                                padding: '6px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700',
                                textTransform: 'uppercase', display: 'inline-block'
                            }}>
                                {user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya') ? 'DRIVER & ADMIN' : (user.role || 'Customer')}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Driver Feedback Section */}
                {(user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya')) && (
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.4rem' }}>Performance Feedback</h3>
                            {feedbacks.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{avgRating}</span>
                                    <span style={{ color: '#f5b754', fontSize: '1.2rem' }}>★</span>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>({feedbacks.length} reviews)</span>
                                </div>
                            )}
                        </div>

                        {loadingFeedback ? (
                            <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>Loading reviews...</p>
                        ) : feedbacks.length === 0 ? (
                            <p style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No feedback received yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {feedbacks.map(f => (
                                    <div key={f._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{f.customerName}</strong>
                                            <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(f.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ color: '#f5b754', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                            {'★'.repeat(Math.round(f.rating))}{'☆'.repeat(5 - Math.round(f.rating))}
                                        </div>
                                        {f.comment && <p style={{ margin: 0, color: '#ccc', fontStyle: 'italic', fontSize: '0.95rem' }}>"{f.comment}"</p>}
                                        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '0.8rem' }}>Trip: {new Date(f.tripDate).toLocaleDateString()} | Booking ID: {f.booking_id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            flex: 1, padding: '14px', background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444',
                            borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem',
                        }}>
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
