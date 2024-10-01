import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Layout from './components/layout/Layout';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const App = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isProfileOpen, setProfileIsOpen] = React.useState(false);

    const openSidebar = () => {
        setIsOpen(true);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const closeProfile = () => {
        setProfileIsOpen(false);
    };

    const toggleProfile = () => {
        setProfileIsOpen(!isProfileOpen);
    };

    return (
        <Router>
            <>
                <Navbar openSidebar={openSidebar} toggleProfile={toggleProfile} />
                <Layout
                    isOpen={isOpen}
                    isProfileOpen={isProfileOpen}
                    openSidebar={openSidebar}
                    closeSidebar={closeSidebar}
                    closeProfile={closeProfile}
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* Use element prop */}
                        {/* Add more routes as needed */}
                    </Routes>
                </Layout>
                <div className={`${isProfileOpen && 'lg:block hidden'}`}>
                    <Footer />
                </div>
            </>
        </Router>
    );
};

export default App;
