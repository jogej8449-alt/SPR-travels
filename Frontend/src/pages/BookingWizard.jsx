import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';
import ContactSupport from '../components/ContactSupport';

// ── Constants ─────────────────────────────────────────────────────
const OCCASIONS = [
    { icon: '🚗', name: 'Long Drive', hasDecoration: false },
    { icon: '💍', name: 'Wedding', hasDecoration: true },
    { icon: '🎉', name: 'Function', hasDecoration: true },
    { icon: '🎂', name: 'Birthday', hasDecoration: true },
    { icon: '💎', name: 'Engagement', hasDecoration: true },
    { icon: '🎊', name: 'Reception', hasDecoration: true },
    { icon: '💼', name: 'Corporate Event', hasDecoration: false },
    { icon: '👨‍👩‍👧', name: 'Family Function', hasDecoration: true },
];

const DECORATION_OPTIONS = [
    { value: 'none', label: 'No Decoration', price: '₹0', color: '#888' },
    { value: 'basic', label: 'Basic', price: '₹500', color: '#10b981' },
    { value: 'premium', label: 'Premium', price: '₹1,000', color: '#f59e0b' },
    { value: 'luxury', label: 'Luxury', price: '₹1,500', color: '#a78bfa' },
];

const TIME_OPTIONS = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM',
];

const PROGRESS_STEPS = ['Location', 'Event', 'Vehicle', 'Details', 'Customer', 'Summary', 'Cash', 'Success'];

// ─────────────────────────────────────────────────────────────────
const BookingWizard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // ── Wizard Step ──────────────────────────────────────────────
    // Steps: 1=Pickup, 2=Drop, 3=Event, 4=Vehicle, 5=Details, 6=Summary, 7=Cash, 8=Success
    const [step, setStep] = useState(1);

    // ── Location State ───────────────────────────────────────────
    const [pickupLocation, setPickupLocation] = useState(null); // {address,lat,lng}
    const [dropLocation, setDropLocation] = useState(null);

    // ── Event State ──────────────────────────────────────────────
    const [occasion, setOccasion] = useState('');
    const [decoration, setDecoration] = useState('none');

    // ── Vehicle State ────────────────────────────────────────────
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);
    const [pricingPackages, setPricingPackages] = useState([]);

    // ── Details State ────────────────────────────────────────────
    const [tripDate, setTripDate] = useState('');
    const [tripTime, setTripTime] = useState('10:00 AM');
    const [passengers, setPassengers] = useState(1);

    // ── Customer State ───────────────────────────────────────────
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    // ── Booking State ────────────────────────────────────────────
    const [submitting, setSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);
    const [submitError, setSubmitError] = useState('');

    // ── Fetch vehicles ────────────────────────────────────────────
    useEffect(() => {
        setVehiclesLoading(true);
        axios.get('/api/cars').then(res => {
            setVehicles(res.data || []);
            setVehiclesLoading(false);
        }).catch(() => setVehiclesLoading(false));

        axios.get('/api/pricing').then(res => {
            setPricingPackages(res.data?.pricing || []);
        }).catch(() => { });
    }, []);

    // ── Navigation helpers ────────────────────────────────────────
    const next = () => setStep(s => s + 1);
    const prev = () => setStep(s => s - 1);

    // ── Submit Booking ────────────────────────────────────────────
    const submitBooking = async () => {
        if (!user) { navigate('/login'); return; }
        setSubmitting(true);
        setSubmitError('');

        const occasionObj = OCCASIONS.find(o => o.name === occasion);
        const decorationType = occasionObj?.hasDecoration ? decoration : 'none';

        const payload = {
            car: selectedVehicle._id,
            carName: selectedVehicle.name,
            occasion,
            decorationRequired: decorationType !== 'none',
            decorationType,
            pickupLocation: pickupLocation.address,
            pickupLatitude: pickupLocation.lat,
            pickupLongitude: pickupLocation.lng,
            dropoffLocation: dropLocation.address,
            dropLatitude: dropLocation.lat,
            dropLongitude: dropLocation.lng,
            startDate: tripDate,
            startTime: tripTime,
            passengers,
            customerName,
            customerPhone,
            customerAddress
        };

        try {
            const { data } = await axios.post('/api/bookings', payload);
            if (data.success) {
                setBookingResult(data.booking);
                setStep(9); // Success/Waiting
            }
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Progress bar (visible steps 1-8) ─────────────────────────
    // step 1=Pickup, 2=Drop → progress step 1 "Location"
    // step 3=Event → 2, step 4=Vehicle → 3, step 5=Details → 4, step 6=Customer → 5
    // step 7=Summary → 6, step 8=Cash → 7, step 9=Success → 8
    const progressStep = step <= 2 ? 1 : step === 3 ? 2 : step === 4 ? 3 : step === 5 ? 4 : step === 6 ? 5 : step === 7 ? 6 : step === 8 ? 7 : 8;

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 5%' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h2 style={{ color: 'white', marginBottom: '1rem' }}>Sign in to Book</h2>
                <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh' }}>

            {/* Progress Bar */}
            {step < 9 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {PROGRESS_STEPS.map((label, i) => {
                        const stepNum = i + 1;
                        const done = progressStep > stepNum;
                        const active = progressStep === stepNum;
                        return (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    opacity: done || active ? 1 : 0.35,
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem',
                                        background: done ? '#10b981' : active ? '#f5b754' : 'rgba(255,255,255,0.1)',
                                        color: done || active ? '#000' : '#fff',
                                        minWidth: '28px',
                                    }}>
                                        {done ? '✓' : stepNum}
                                    </div>
                                    <span style={{ fontSize: '0.78rem', color: active ? '#f5b754' : done ? '#10b981' : '#aaa', fontWeight: active ? 700 : 400 }}>
                                        {label}
                                    </span>
                                </div>
                                {i < PROGRESS_STEPS.length - 1 && (
                                    <div style={{ width: '20px', height: '1px', background: done ? '#10b981' : 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* ─── STEP 1: PICKUP MAP ─────────────────────────── */}
                {step === 1 && (
                    <LocationPicker
                        mode="pickup"
                        initialLocation={pickupLocation}
                        onLocationConfirm={(loc) => { setPickupLocation(loc); next(); }}
                        onBack={() => navigate(-1)}
                    />
                )}

                {/* ─── STEP 2: DROP MAP ───────────────────────────── */}
                {step === 2 && (
                    <LocationPicker
                        mode="drop"
                        initialLocation={dropLocation}
                        onLocationConfirm={(loc) => { setDropLocation(loc); next(); }}
                        onBack={prev}
                    />
                )}

                {/* ─── STEP 3: EVENT SELECTION ─────────────────────── */}
                {step === 3 && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <button onClick={prev} style={bk}>← Back</button>
                        <h2 style={sh}>🎯 Select Your Occasion</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {OCCASIONS.map(o => (
                                <div
                                    key={o.name}
                                    onClick={() => { setOccasion(o.name); if (!o.hasDecoration) setDecoration('none'); }}
                                    style={{
                                        padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                                        border: occasion === o.name ? '2px solid #f5b754' : '1px solid rgba(255,255,255,0.1)',
                                        background: occasion === o.name ? 'rgba(245,183,84,0.12)' : 'rgba(255,255,255,0.04)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{o.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: occasion === o.name ? '#f5b754' : '#fff' }}>{o.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Decoration for eligible occasions */}
                        {occasion && OCCASIONS.find(o => o.name === occasion)?.hasDecoration && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{ color: '#f5b754', marginBottom: '1rem', fontSize: '1rem' }}>🎀 Decoration Option</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.8rem' }}>
                                    {DECORATION_OPTIONS.map(d => (
                                        <div
                                            key={d.value}
                                            onClick={() => setDecoration(d.value)}
                                            style={{
                                                padding: '1rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                                                border: decoration === d.value ? `2px solid ${d.color}` : '1px solid rgba(255,255,255,0.1)',
                                                background: decoration === d.value ? `rgba(${d.color === '#888' ? '136,136,136' : d.color === '#10b981' ? '16,185,129' : d.color === '#f59e0b' ? '245,158,11' : '167,139,250'},0.1)` : 'rgba(255,255,255,0.03)',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{ fontWeight: 700, color: decoration === d.value ? d.color : '#fff', fontSize: '0.9rem' }}>{d.label}</div>
                                            <div style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '3px' }}>{d.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                            onClick={() => { if (!occasion) return alert('Select an occasion'); next(); }}
                        >
                            CONTINUE TO VEHICLE →
                        </button>
                    </div>
                )}

                {/* ─── STEP 4: VEHICLE SELECTION ───────────────────── */}
                {step === 4 && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <button onClick={prev} style={bk}>← Back</button>
                        <h2 style={sh}>🚗 Select Vehicle</h2>
                        {vehiclesLoading ? (
                            <p style={{ color: '#aaa', marginTop: '1rem' }}>Loading vehicles...</p>
                        ) : vehicles.length === 0 ? (
                            <p style={{ color: '#aaa', marginTop: '1rem' }}>No vehicles available. Please contact admin.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                {vehicles.map(v => (
                                    <div
                                        key={v._id}
                                        onClick={() => setSelectedVehicle(v)}
                                        style={{
                                            padding: '1.25rem 1.5rem', borderRadius: '12px', cursor: 'pointer',
                                            border: selectedVehicle?._id === v._id ? '2px solid #f5b754' : '1px solid rgba(255,255,255,0.1)',
                                            background: selectedVehicle?._id === v._id ? 'rgba(245,183,84,0.08)' : 'rgba(255,255,255,0.03)',
                                            display: 'flex', alignItems: 'center', gap: '1.5rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{ fontSize: '3rem' }}>🚘</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: selectedVehicle?._id === v._id ? '#f5b754' : '#fff' }}>
                                                {v.name}
                                            </div>
                                            <div style={{ color: '#aaa', fontSize: '0.88rem', marginTop: '3px' }}>
                                                {v.seats} Seater
                                                {' · '}
                                                {v.driverRequired ? '👨‍✈️ Driver Included' : '🔑 Self Drive Available'}
                                            </div>
                                            {v.driverRequired && (
                                                <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>
                                                    ✓ Professional Driver Mandatory
                                                </div>
                                            )}
                                        </div>
                                        {selectedVehicle?._id === v._id && (
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f5b754', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '0.85rem' }}>✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            className="btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                            onClick={() => { if (!selectedVehicle) return alert('Select a vehicle'); next(); }}
                        >
                            CONTINUE TO DETAILS →
                        </button>
                    </div>
                )}

                {/* ─── STEP 5: TRIP DETAILS ────────────────────────── */}
                {step === 5 && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <button onClick={prev} style={bk}>← Back</button>
                        <h2 style={sh}>📅 Trip Details</h2>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.25rem' }}>
                            <div>
                                <label style={lbl}>📅 Date</label>
                                <input
                                    type="date"
                                    value={tripDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setTripDate(e.target.value)}
                                    style={inp}
                                />
                            </div>
                            <div>
                                <label style={lbl}>🕐 Start Time</label>
                                <select value={tripTime} onChange={e => setTripTime(e.target.value)} style={inp}>
                                    {TIME_OPTIONS.map(t => <option key={t} value={t} style={{ color: '#000' }}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>👥 Passengers</label>
                                <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} style={inp}>
                                    {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                            onClick={() => { if (!tripDate) return alert('Please select a date'); next(); }}
                        >
                            CONTINUE TO CUSTOMER INFO →
                        </button>
                    </div>
                )}

                {/* ─── STEP 6: CUSTOMER DETAILS ─────────────────────── */}
                {step === 6 && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <button onClick={prev} style={bk}>← Back</button>
                        <h2 style={sh}>👤 Customer Details</h2>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.25rem' }}>
                            <div>
                                <label style={lbl}>👤 Full Name</label>
                                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} style={inp} placeholder="Enter customer's full name for proof" />
                            </div>
                            <div>
                                <label style={lbl}>📱 Phone Number</label>
                                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={inp} placeholder="Enter active phone number" />
                            </div>
                            <div>
                                <label style={lbl}>🏠 Address</label>
                                <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Enter full residential address for verification" />
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                            onClick={() => { if (!customerName || !customerPhone || !customerAddress) return alert('Please fill in all customer details'); next(); }}
                        >
                            CONTINUE TO SUMMARY →
                        </button>
                    </div>
                )}

                {/* ─── STEP 7: BOOKING SUMMARY ─────────────────────── */}
                {step === 7 && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <button onClick={prev} style={bk}>← Back</button>
                        <h2 style={sh}>📋 Booking Summary</h2>

                        <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px' }}>
                            <Row label="📍 Pickup" value={pickupLocation?.address} />
                            <Row label="📍 Drop" value={dropLocation?.address} />
                            <Row label="🎯 Event" value={occasion} />
                            <Row label="🚘 Vehicle" value={`${selectedVehicle?.name} (${selectedVehicle?.seats} Seater)`} />
                            <Row label="📅 Date" value={tripDate} />
                            <Row label="🕐 Time" value={tripTime} />
                            <Row label="👥 Passengers" value={passengers} />
                            {decoration !== 'none' && <Row label="🎀 Decoration" value={DECORATION_OPTIONS.find(d => d.value === decoration)?.label} />}

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                            <h4 style={{ color: '#f5b754', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>👤 Customer Info</h4>
                            <Row label="👤 Name" value={customerName} />
                            <Row label="📱 Phone" value={customerPhone} />
                            <Row label="🏠 Address" value={customerAddress} />
                        </div>

                        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', color: '#10b981', fontSize: '0.88rem', fontWeight: 600 }}>
                            💵 Payment Method: Offline Cash Only
                        </div>

                        <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={next}>
                            PROCEED TO CASH PAYMENT →
                        </button>
                    </div>
                )}

                {/* ─── STEP 8: CASH PAYMENT ────────────────────────── */}
                {step === 8 && (
                    <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <button onClick={prev} style={{ ...bk, marginBottom: '1.5rem' }}>← Back</button>

                        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>💵</div>
                        <h2 style={{ color: '#f5b754', fontSize: '1.6rem', marginBottom: '0.5rem' }}>OFFLINE CASH PAYMENT</h2>
                        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Please give the exact rental amount in cash to the authorized cashier or driver.</p>

                        <div style={{ background: 'rgba(245,183,84,0.08)', border: '1px solid rgba(245,183,84,0.25)', borderRadius: '14px', padding: '2rem', marginBottom: '2rem' }}>
                            <p style={{ color: '#aaa', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Payment Instructions</p>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f5b754', lineHeight: 1.3 }}>Negotiable Amount<br />Will Be Finalized Offline</div>
                            <p style={{ color: '#888', fontSize: '0.82rem', marginTop: '12px' }}>💵 S. Annamayya will handle the cash directly · No Online Payment</p>
                        </div>

                        {submitError && (
                            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '1rem', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                ❌ {submitError}
                            </div>
                        )}

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
                            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 Pickup: <span style={{ color: '#fff' }}>{pickupLocation?.address}</span></p>
                            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 Drop: <span style={{ color: '#fff' }}>{dropLocation?.address}</span></p>
                            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>🎯 {occasion} · 🚘 {selectedVehicle?.name} · 📅 {tripDate}</p>
                        </div>

                        <button
                            onClick={submitBooking}
                            disabled={submitting}
                            className="btn-primary"
                            style={{ width: '100%', padding: '18px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px', opacity: submitting ? 0.7 : 1 }}
                        >
                            {submitting ? '⏳ Creating Booking...' : '✓ CONFIRM & SUBMIT BOOKING'}
                        </button>

                        <p style={{ color: '#555', fontSize: '0.78rem', marginTop: '1rem', marginBottom: '2rem' }}>
                            Your booking will be confirmed once the cashier receives and verifies the cash payment.
                        </p>

                        <ContactSupport />
                    </div>
                )}

                {/* ─── STEP 9: WAITING / SUCCESS ───────────────────── */}
                {step === 9 && bookingResult && (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderTop: '3px solid #f5b754' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
                        <h1 style={{ color: '#f5b754', fontSize: '1.8rem', marginBottom: '0.5rem' }}>BOOKING SUBMITTED!</h1>
                        <p style={{ color: '#aaa', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem auto' }}>
                            Your booking has been created. Please hand the cash to our authorized cashier to confirm your booking and receive your Booking ID.
                        </p>

                        <div style={{ background: 'rgba(245,183,84,0.08)', border: '1px solid rgba(245,183,84,0.25)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                            <p style={{ color: '#aaa', fontSize: '0.82rem', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Payment Status</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f5b754' }}>Awaiting Pricing by S. Annamayya</div>
                            <p style={{ color: '#10b981', fontWeight: 600, marginTop: '8px', fontSize: '0.9rem' }}>⏳ WAITING FOR CASH PAYMENT</p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
                            <h4 style={{ color: '#f5b754', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Trip Details</h4>
                            <Row label="📍 Pickup" value={pickupLocation?.address} />
                            <Row label="📍 Drop" value={dropLocation?.address} />
                            <Row label="🎯 Event" value={occasion} />
                            <Row label="🚘 Vehicle" value={selectedVehicle?.name} />
                            <Row label="📅 Date" value={tripDate} />
                            <Row label="🕐 Time" value={tripTime} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={() => navigate('/mybookings')} style={{ padding: '12px 28px' }}>
                                📋 BOOKING HISTORY
                            </button>
                            <button onClick={() => navigate('/')} style={{ padding: '12px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                🏠 HOME
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Shared micro-components (defined outside render to prevent remounting) ──
const bk = { background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', transition: 'color 0.2s' };
const sh = { fontWeight: 700, fontSize: 'clamp(1.2rem,4vw,1.6rem)', color: '#fff', marginBottom: '0.25rem' };
const lbl = { display: 'block', marginBottom: '6px', color: '#aaa', fontSize: '0.9rem', fontWeight: 600 };
const inp = { width: '100%', padding: '11px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' };

function Row({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '3px 0' }}>
            <span style={{ color: '#888', fontSize: '0.85rem', minWidth: '120px', flexShrink: 0 }}>{label}</span>
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
        </div>
    );
}





export default BookingWizard;
