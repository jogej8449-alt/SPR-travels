const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'cashier')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin or cashier' });
    }
};

export { admin };
