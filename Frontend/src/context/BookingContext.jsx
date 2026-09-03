import { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [activeBooking, setActiveBooking] = useState(null);

    return (
        <BookingContext.Provider value={{ activeBooking, setActiveBooking }}>
            {children}
        </BookingContext.Provider>
    );
};
