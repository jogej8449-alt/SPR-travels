import OccasionCard from '../components/OccasionCard';

const Occasion = () => {
    const occasions = [
        { title: 'Wedding', desc: 'Premium luxury cars for your special day' },
        { title: 'Long Drive', desc: 'Comfortable SUVs for family trips' },
        { title: 'Corporate Event', desc: 'Professional chauffeur-driven sedans' }
    ];

    return (
        <div style={{ padding: '3rem 5%' }}>
            <h1 className="heading text-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>Vehicle Occasions</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {occasions.map((occ, idx) => (
                    <OccasionCard key={idx} occasion={occ.title} description={occ.desc} />
                ))}
            </div>
        </div>
    );
};

export default Occasion;
