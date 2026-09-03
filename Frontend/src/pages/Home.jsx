import { Link } from 'react-router-dom';
import ContactSupport from '../components/ContactSupport';

const Home = () => {
    return (
        <div style={{ minHeight: '90vh', padding: '4rem 5%', display: 'flex', flexDirection: 'column' }}>

            {/* MAIN HERO SPLIT LAYOUT */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>

                {/* ── LEFT COLUMN: Text & Actions ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>

                    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                        <span className="float-emoji">🚗</span>
                        <span className="float-emoji" style={{ animationDelay: '0.6s', margin: '0 1rem' }}>🚙</span>
                        <span className="float-emoji" style={{ animationDelay: '1.2s' }}>🚘</span>
                    </div>

                    <h1 className="heading text-gradient" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.05, marginBottom: '1.2rem' }}>
                        SPR RIDES
                    </h1>

                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--text-secondary-dark)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '3rem' }}>
                        Premium vehicles with professional drivers.<br />
                        Every journey. Every occasion.
                    </p>

                    {/* TWO PRIMARY ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '500px' }}>
                        {/* SAMPLE SHOWCASE */}
                        <Link to="/showcase" style={{ flex: '1 1 200px', textDecoration: 'none' }}>
                            <button style={{
                                width: '100%', padding: '20px 32px', fontSize: '1.15rem', fontWeight: '700',
                                borderRadius: '14px', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.07)', color: '#fff', backdropFilter: 'blur(12px)',
                                letterSpacing: '0.5px', transition: 'all 0.3s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                ✨ SHOWCASE
                            </button>
                        </Link>

                        {/* BOOKING */}
                        <Link to="/booking" style={{ flex: '1 1 200px', textDecoration: 'none' }}>
                            <button style={{
                                width: '100%', padding: '20px 32px', fontSize: '1.15rem', fontWeight: '700',
                                borderRadius: '14px', cursor: 'pointer', border: 'none',
                                background: 'linear-gradient(135deg, #f5b754 0%, #e8920a 100%)', color: '#000',
                                letterSpacing: '0.5px', transition: 'all 0.3s ease', boxShadow: '0 8px 30px rgba(245,183,84,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(245,183,84,0.55)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,183,84,0.35)';
                                }}>
                                🚗 BOOKING
                            </button>
                        </Link>
                    </div>

                    {/* Subtle Badge */}
                    <p style={{ marginTop: '2.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Offline Cash · Driver Included · Any Occasion
                    </p>
                </div>

                {/* ── RIGHT COLUMN: Car Showcase Image ── */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {/* Glowing effect under the car */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '80%', height: '60%',
                        background: 'var(--primary-color)',
                        filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', zIndex: 0
                    }} />

                    <img
                        src="/images/kia-carens.jpg"
                        alt="Premium Kia Carens"
                        style={{
                            width: '100%', maxWidth: '650px', height: 'auto',
                            objectFit: 'contain', zIndex: 1, position: 'relative',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                            borderRadius: '16px'
                        }}
                    />
                </div>

            </div>

            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                <ContactSupport />
            </div>

        </div>
    );
};

export default Home;
