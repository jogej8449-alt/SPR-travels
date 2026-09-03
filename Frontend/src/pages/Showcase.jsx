import { useNavigate } from 'react-router-dom';
import ContactSupport from '../components/ContactSupport';

const OCCASIONS = [
    { icon: '🚗', name: 'Long Drive', desc: 'Comfortable rides for long journeys.' },
    { icon: '💍', name: 'Wedding', desc: 'Make your special day more memorable.' },
    { icon: '🎉', name: 'Function', desc: 'Reliable travel for every celebration.' },
    { icon: '🎂', name: 'Birthday', desc: 'Travel comfortably with your loved ones.' },
    { icon: '💎', name: 'Engagement', desc: 'Make your special occasion memorable.' },
    { icon: '🎊', name: 'Reception', desc: 'Comfortable transportation for your guests.' },
    { icon: '💼', name: 'Corporate Event', desc: 'Professional transportation for business events.' },
    { icon: '👨‍👩‍👧', name: 'Family Function', desc: 'Comfortable rides for family occasions.' },
];

const WHY_US = [
    { icon: '🛡️', title: 'Reliable Service', desc: 'Dependable rides for every occasion, every time.' },
    { icon: '👨‍✈️', title: 'Professional Drivers', desc: 'Experienced, courteous, and licensed drivers.' },
    { icon: '🚘', title: 'Comfortable Vehicles', desc: 'Well-maintained, spacious, and air-conditioned.' },
    { icon: '💵', title: 'Simple Offline Cash Payment', desc: 'No digital payments. Pay in cash to our cashier.' },
    { icon: '⭐', title: 'Customer Friendly', desc: 'We put your comfort and satisfaction first.' },
];

const HOW_STEPS = [
    { n: '01', title: 'Choose Your Occasion', desc: 'Tell us the purpose of your journey.' },
    { n: '02', title: 'Select Your Locations', desc: 'Pick your pickup and drop points on the map.' },
    { n: '03', title: 'Choose Your Vehicle', desc: 'Select from our available fleet.' },
    { n: '04', title: 'Review Your Booking', desc: 'Confirm all details and total price.' },
    { n: '05', title: 'Pay Offline in Cash', desc: 'Hand the exact amount to our authorized cashier.' },
];

const Showcase = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh' }}>

            {/* ── Back Button ── */}
            <div style={{ padding: '1.5rem 5% 0' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = '#aaa'}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* ── Hero ── */}
            <section style={{ textAlign: 'center', padding: '4rem 5% 3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                    <span className="float-emoji">🚗</span>
                    <span className="float-emoji" style={{ animationDelay: '0.5s', margin: '0 1.5rem' }}>🚘</span>
                    <span className="float-emoji" style={{ animationDelay: '1s' }}>🚙</span>
                </div>
                <h1 className="heading text-gradient" style={{ fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 1.05, marginBottom: '1rem' }}>
                    SPR RIDES
                </h1>
                <p style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 600, marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    "Every Journey Deserves the Right Ride."
                </p>
                <p style={{ color: '#a0aec0', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                    Reliable vehicles and professional drivers for journeys, celebrations and special occasions.
                </p>
            </section>

            {/* ── ONE SERVICE. EVERY OCCASION. ── */}
            <section style={{ padding: '3rem 5%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
                        ONE SERVICE. <span className="text-gradient">EVERY OCCASION.</span>
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
                    {OCCASIONS.map(o => (
                        <div
                            key={o.name}
                            className="glass-panel"
                            style={{ padding: '1.75rem 1.5rem', textAlign: 'center', cursor: 'default' }}
                        >
                            <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>{o.icon}</div>
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{o.name}</h3>
                            <p style={{ color: '#a0aec0', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{o.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Vehicle Visual ── */}
            <section style={{ padding: '3rem 5%', background: 'rgba(13,26,48,0.4)' }}>
                <div style={{
                    maxWidth: '900px', margin: '0 auto', display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            <span className="float-emoji">🚗</span>
                            <span className="float-emoji" style={{ animationDelay: '0.4s', margin: '0 0.5rem' }}>🚘</span>
                            <span className="float-emoji" style={{ animationDelay: '0.8s' }}>🚙</span>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                            Comfortable Rides.
                        </h2>
                        <p className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Professional Service.</p>
                    </div>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {['Comfortable Vehicles', 'Professional Drivers', 'Flexible Rental Duration', 'Multiple Occasions', 'Reliable Service', 'Easy Booking'].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
                                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                                <span style={{ color: '#fff', fontWeight: 500 }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section style={{ padding: '4rem 5%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 800, color: '#fff' }}>
                        HOW IT <span className="text-gradient">WORKS</span>
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {HOW_STEPS.map(s => (
                        <div key={s.n} className="glass-panel" style={{ padding: '1.75rem 1.25rem', textAlign: 'center', cursor: 'default' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'linear-gradient(135deg,#f5b754,#e8920a)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '1rem', color: '#000',
                                margin: '0 auto 1rem auto',
                            }}>{s.n}</div>
                            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{s.title}</h4>
                            <p style={{ color: '#a0aec0', fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section style={{ padding: '3rem 5%', background: 'rgba(13,26,48,0.4)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 800, color: '#fff' }}>
                        WHY CHOOSE <span className="text-gradient">RIDE RENT?</span>
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
                    {WHY_US.map(w => (
                        <div key={w.title} className="glass-panel" style={{ padding: '2rem 1.5rem', textAlign: 'center', cursor: 'default', borderTop: '2px solid rgba(245,183,84,0.3)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{w.icon}</div>
                            <h3 style={{ color: '#f5b754', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{w.title}</h3>
                            <p style={{ color: '#a0aec0', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Bottom: YOUR JOURNEY STARTS HERE ── */}
            <section style={{ padding: '5rem 5%', textAlign: 'center' }}>
                <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    – – –
                </p>
                <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '1.5rem' }}>
                    YOUR JOURNEY <span className="text-gradient">STARTS HERE</span>
                </h2>
                <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
                    <span className="float-emoji">🚗</span>
                    <span className="float-emoji" style={{ animationDelay: '0.5s', margin: '0 1.5rem' }}>🚘</span>
                    <span className="float-emoji" style={{ animationDelay: '1s' }}>🚙</span>
                </div>
                <p style={{ color: '#a0aec0', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                    Reliable vehicles. Professional drivers. Your occasions, perfectly served.
                </p>
                <div style={{ marginTop: '2.5rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', color: '#aaa', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </section>

            <ContactSupport />
        </div>
    );
};

export default Showcase;
