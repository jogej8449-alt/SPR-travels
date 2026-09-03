import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext as useCtx } from 'react';
import { AuthContext } from '../context/AuthContext';
import { logout as logoutService } from '../services/authService';

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutService();
        setUser(null);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        color: isActive(path) ? 'var(--primary-color)' : '#ccc',
        fontWeight: isActive(path) ? '700' : '500',
        fontSize: '0.95rem',
        borderBottom: isActive(path) ? '2px solid var(--primary-color)' : '2px solid transparent',
        paddingBottom: '4px',
        transition: 'color 0.2s ease',
        textDecoration: 'none',
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'cashier';

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 5%',
            alignItems: 'center',
            backdropFilter: 'blur(20px)',
            background: 'rgba(7, 16, 31, 0.85)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
            {/* LOGO */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <span style={{ fontSize: '2rem' }}>🚗</span>
                <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    SPR RIDES
                </span>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {isAdmin ? (
                    <>
                        <Link to="/admin" style={linkStyle('/admin')}>🏠 Dashboard</Link>
                        <Link to="/admin/bookings" style={linkStyle('/admin/bookings')}>📋 Bookings</Link>
                        <Link to="/admin/cashier" style={linkStyle('/admin/cashier')}>💵 Cashier</Link>
                    </>
                ) : (
                    <>
                        <Link to="/" style={linkStyle('/')}>🏠 Dashboard</Link>
                        <Link to="/mybookings" style={linkStyle('/mybookings')}>📋 History</Link>
                        <Link to="/notifications" style={linkStyle('/notifications')}>🔔 Notifications</Link>
                        <Link to="/profile" style={linkStyle('/profile')}>👤 Profile</Link>
                    </>
                )}

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            {user.name?.toLowerCase().includes('annamayya') || user.name?.toLowerCase().includes('annamaya') ? (
                                <img
                                    src="/images/daddy.png"
                                    alt="Admin"
                                    style={{
                                        width: '38px', height: '38px', borderRadius: '50%',
                                        objectFit: 'cover', cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        border: '2px solid var(--primary-color)',
                                        boxShadow: '0 0 10px rgba(245,183,84,0.3)',
                                        display: 'block'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            ) : (
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    background: 'var(--primary-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', color: '#000', fontSize: '1.1rem',
                                    cursor: 'pointer', transition: 'transform 0.2s',
                                    boxShadow: '0 0 10px rgba(245,183,84,0.3)'
                                }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent', border: '1px solid rgba(245,183,84,0.4)',
                                color: 'var(--primary-color)', padding: '8px 18px',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = '#000'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="btn-primary" style={{ padding: '8px 22px' }}>Sign In</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
