export const calculateTotalPrice = (days, carPrice, hasDriver = false, driverPrice = 0) => {
    const baseCost = days * carPrice;
    const driverCost = hasDriver ? (days * driverPrice) : 0;
    return baseCost + driverCost;
};
