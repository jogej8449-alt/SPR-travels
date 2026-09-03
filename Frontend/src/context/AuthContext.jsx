import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Read from localStorage on mount
        const savedUser = localStorage.getItem('luxeride_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Watch for changes and save to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('luxeride_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('luxeride_user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
