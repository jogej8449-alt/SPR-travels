import Pricing from '../models/Pricing.js';

// GET /api/pricing - get all pricing packages
export const getPricing = async (req, res) => {
    try {
        const pricing = await Pricing.find({ active: true }).populate('vehicle', 'name');
        res.json({ success: true, pricing });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// POST /api/pricing - create pricing (admin)
export const createPricing = async (req, res) => {
    try {
        const pricing = new Pricing(req.body);
        const saved = await pricing.save();
        res.status(201).json({ success: true, pricing: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// PUT /api/pricing/:id - update pricing (admin)
export const updatePricing = async (req, res) => {
    try {
        const updated = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Pricing not found' });
        res.json({ success: true, pricing: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// DELETE /api/pricing/:id - delete pricing (admin)
export const deletePricing = async (req, res) => {
    try {
        await Pricing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Pricing deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
