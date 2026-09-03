const Footer = () => {
    return (
        <footer style={{
            background: '#0a0a0a',
            padding: '3rem 5%',
            marginTop: 'auto',
            borderTop: '1px solid var(--glass-border)',
            textAlign: 'center',
            color: 'var(--text-secondary-dark)'
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>SPR Rides</h2>
                <p>Premium car rental experiences for every occasion.</p>
            </div>
            <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} SPR Rides. All rights reserved.</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', marginTop: '10px', letterSpacing: '0.5px' }}>Designed & Developed by Sheggam Mounika</p>
        </footer>
    );
};

export default Footer;
