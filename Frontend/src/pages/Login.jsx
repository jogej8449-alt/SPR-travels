import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            setUser(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: '10px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.06)', color: 'white',
        outline: 'none', fontSize: '1rem',
        transition: 'border-color 0.2s ease',
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '90vh', padding: '2rem 5%',
        }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚗</div>
                    <h1 className="heading text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary-dark)' }}>Sign in to your RideRent account</p>
                </div>

                {/* Card */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444', padding: '12px 16px', borderRadius: '8px',
                            marginBottom: '1.5rem', fontSize: '0.9rem',
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary-dark)', fontSize: '0.9rem', fontWeight: '600' }}>
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary-dark)', fontSize: '0.9rem', fontWeight: '600' }}>
                                🔒 Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ padding: '15px', fontSize: '1.1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? '⏳ Signing In...' : '🚗 SIGN IN'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary-dark)' }}>
                        New to RideRent?{' '}
                        <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
