import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home.jsx';
import Cars from '../pages/Cars.jsx';
import CarDetails from '../pages/CarDetails.jsx';
import Occasion from '../pages/Occasion.jsx';
import Showcase from '../pages/Showcase.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import BookingWizard from '../pages/BookingWizard.jsx';
import MyBookings from '../pages/MyBookings.jsx';
import BookingDetails from '../pages/BookingDetails.jsx';
import Receipt from '../pages/Receipt.jsx';
import Notifications from '../pages/Notifications.jsx';
import NotFound from '../pages/NotFound.jsx';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminBookings from '../pages/admin/Bookings.jsx';
import AdminCars from '../pages/admin/Car.jsx';
import AdminDrivers from '../pages/admin/Drivers.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminCashier from '../pages/AdminCashier.jsx';
import AdminPricing from '../pages/admin/AdminPricing.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/book/:id" element={<CarDetails />} />
            <Route path="/occasion" element={<Occasion />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking" element={<BookingWizard />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/mybookings/:id" element={<BookingDetails />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/cashier" element={<AdminCashier />} />
            <Route path="/cashier" element={<AdminCashier />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
