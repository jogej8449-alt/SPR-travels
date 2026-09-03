import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="heading text-gradient" style={{ fontSize: '6rem', marginBottom: '10px' }}>404</h1>
            <p style={{ color: 'var(--text-secondary-dark)', fontSize: '1.2rem', marginBottom: '2rem' }}>Oops! Code page not found.</p>
            <Link to="/">
                <button className="btn-primary">Return Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
