import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content" style={{ minHeight: '80vh' }}>
                    <AppRoutes />
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
