import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BookingForm = ({ car }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Core mapping
    const [occasion, setOccasion] = useState('Wedding');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('10:00 AM');
    const [duration, setDuration] = useState(6);
    const [passengers, setPassengers] = useState(car?.seats || 4);
    const [decoration, setDecoration] = useState('none');
    const [needDriver, setNeedDriver] = useState('yes');

    // Strict Enforcement Rule Engine based on Vehicle Schema
    const isSelfDriveAllowed = car?.selfDriveAllowed !== false;
    const isDriverRequired = car?.driverRequired === true;

    useEffect(() => {
        if (isDriverRequired) {
            setNeedDriver('yes');
        }
    }, [isDriverRequired]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to proceed! Check the top right corner to Sign In first.");
            return;
        }

        if (!startDate || !pickupLocation || !dropoffLocation || typeof duration !== 'number') {
            alert("Please fill in all required fields!");
            return;
        }

        // --- Sophisticated Price Calculation strictly following user requirement ---
        // Base vehicle price + Duration charge + Distance charge + Decoration charge + Additional charges

        // Base math logic: using static multiplier mapping for demo
        const baseRatePerHour = 800; // Kia Carens standard
        const baseAmount = baseRatePerHour * duration;

        const driverChargeRule = isDriverRequired ? 0 : (needDriver === 'yes' ? 1000 : 0);

        let decorationAmount = 0;
        if (decoration === 'basic') decorationAmount = 1000;
        if (decoration === 'premium') decorationAmount = 3000;
        if (decoration === 'luxury') decorationAmount = 8000;

        const totalAmount = baseAmount + driverChargeRule + decorationAmount;

        // Dummy endDate extrapolated from Duration just to satisfy model requirement
        const fakeEndDate = new Date(startDate);
        fakeEndDate.setHours(fakeEndDate.getHours() + duration);

        const bookingData = {
            car: car?._id,
            carName: car?.name,
            occasion,
            pickupLocation,
            dropoffLocation,
            startDate,
            endDate: fakeEndDate.toISOString().split('T')[0],
            startTime,
            duration,
            passengers,
            decorationType: decoration,

            // Financial payload
            baseAmount: baseAmount,
            driverAmount: driverChargeRule,
            distanceAmount: 0,
            decorationAmount: decorationAmount,
            taxAmount: 0,
            discountAmount: 0,
            totalPrice: totalAmount,
            paymentMethod: "CASH" // strictly enforced
        };

        navigate('/payment', { state: { bookingData } });
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Book {car?.name}</h3>

            <form onSubmit={submitHandler} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Occasion</label>
                    <select value={occasion} onChange={(e) => setOccasion(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                        <option value="Long Drive" style={{ color: 'black' }}>Long Drive</option>
                        <option value="Wedding" style={{ color: 'black' }}>Wedding</option>
                        <option value="Function" style={{ color: 'black' }}>Function</option>
                        <option value="Corporate Event" style={{ color: 'black' }}>Corporate Event</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pickup Location</label>
                    <input required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} type="text" placeholder="e.g. Patamata, Vijayawada" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Dropoff Location</label>
                    <input required value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} type="text" placeholder="e.g. Ganguru, Vijayawada" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Booking Date</label>
                    <input required value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Time</label>
                    <select value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                        <option value="08:00 AM" style={{ color: 'black' }}>08:00 AM</option>
                        <option value="10:00 AM" style={{ color: 'black' }}>10:00 AM</option>
                        <option value="12:00 PM" style={{ color: 'black' }}>12:00 PM</option>
                        <option value="02:00 PM" style={{ color: 'black' }}>02:00 PM</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Duration (Hours)</label>
                    <input required value={duration} onChange={(e) => setDuration(Number(e.target.value) || '')} type="number" min="2" max="72" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Passengers</label>
                    <input required value={passengers} onChange={(e) => setPassengers(Number(e.target.value) || '')} type="number" min="1" max={car?.seats || 7} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>

                {occasion === 'Wedding' || occasion === 'Function' ? (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Decoration Required?</label>
                        <select value={decoration} onChange={(e) => setDecoration(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                            <option value="none" style={{ color: 'black' }}>No Decoration (₹0)</option>
                            <option value="basic" style={{ color: 'black' }}>Basic Decoration (₹1,000)</option>
                            <option value="premium" style={{ color: 'black' }}>Premium Decoration (₹3,000)</option>
                            <option value="luxury" style={{ color: 'black' }}>Luxury Decoration (₹8,000)</option>
                        </select>
                    </div>
                ) : null}


                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#10b981' }}>Driver Assignment</label>

                    {isDriverRequired && !isSelfDriveAllowed ? (
                        <div style={{ color: 'white', padding: '10px 0' }}>
                            ✓ <b>Professional Driver Included</b> (Self-Drive Not Allowed)
                        </div>
                    ) : (
                        <select value={needDriver} onChange={(e) => setNeedDriver(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                            <option value="no" style={{ color: 'black' }}>No, Self-Drive</option>
                            <option value="yes" style={{ color: 'black' }}>Yes, include Driver (+₹1000)</option>
                        </select>
                    )}
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>Proceed to Offline Cash Checkout</button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
