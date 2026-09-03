import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await register(name, email, password);
            setUser(data);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 5%' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem 2rem' }}>
                <h2 className="heading text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
                <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary-dark)' }}>Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary-dark)' }}>Email Address</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary-dark)' }}>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '14px', fontSize: '1.1rem' }}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary-dark)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
