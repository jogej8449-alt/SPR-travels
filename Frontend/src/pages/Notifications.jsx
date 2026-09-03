import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        axios.get('/api/notifications')
            .then(res => {
                setNotifications(Array.isArray(res.data) ? res.data.reverse() : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user, navigate]);

    const markRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) { }
    };

    const iconForType = (type) => {
        if (!type) return '🔔';
        const t = type.toLowerCase();
        if (t.includes('confirm')) return '🎉';
        if (t.includes('cash') || t.includes('payment')) return '💵';
        if (t.includes('cancel')) return '❌';
        if (t.includes('driver')) return '👤';
        return '🔔';
    };

    const timeAgo = (date) => {
        const s = Math.floor((Date.now() - new Date(date)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '1rem' }}>← Back</button>
                <h2 className="heading text-gradient" style={{ margin: 0 }}>🔔 Notifications</h2>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary-dark)', marginTop: '4rem' }}>Loading...</p>
            ) : notifications.length === 0 ? (
                <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔔</div>
                    <h3 style={{ color: 'var(--text-secondary-dark)' }}>No new notifications</h3>
                </div>
            ) : (
                <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(n => (
                        <div
                            key={n._id}
                            onClick={() => !n.isRead && markRead(n._id)}
                            style={{
                                padding: '1.5rem', borderRadius: '12px',
                                background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(245,183,84,0.08)',
                                border: n.isRead ? '1px solid var(--glass-border)' : '1px solid rgba(245,183,84,0.3)',
                                cursor: n.isRead ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ fontSize: '2rem', minWidth: '36px', marginTop: '2px' }}>{iconForType(n.type)}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <h4 style={{ margin: 0, color: n.isRead ? 'white' : 'var(--primary-color)' }}>{n.title}</h4>
                                    <span style={{ color: 'var(--text-secondary-dark)', fontSize: '0.8rem' }}>{timeAgo(n.createdAt)}</span>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-secondary-dark)', fontSize: '0.9rem' }}>{n.message}</p>
                            </div>
                            {!n.isRead && (
                                <span style={{ width: '10px', height: '10px', background: 'var(--primary-color)', borderRadius: '50%', marginTop: '6px', minWidth: '10px' }} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
