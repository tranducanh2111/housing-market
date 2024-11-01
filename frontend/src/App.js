import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layout components
import Navbar from 'components/layout/Navbar';
import Layout from 'components/layout/Layout';
import Footer from 'components/layout/Footer';

// Routes
import HomePage from 'pages/HomePage';
import LatestResearch from 'pages/LatestResearch';
import PersonalizeInsight from 'pages/PersonalizeInsight';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import ErrorBoundary from 'components/ErrorBoundary';

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
            <ErrorBoundary> {/* Wrap your components with ErrorBoundary */}
                <Navbar openSidebar={openSidebar} toggleProfile={toggleProfile} />
                <Layout
                    isOpen={isOpen}
                    isProfileOpen={isProfileOpen}
                    openSidebar={openSidebar}
                    closeSidebar={closeSidebar}
                    closeProfile={closeProfile}
                >
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <ErrorBoundary>
                                    <HomePage />
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path="/latest-research" 
                            element={
                                <ErrorBoundary>
                                    <LatestResearch />
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path="/nutrition-guidelines" 
                            element={
                                <ErrorBoundary>
                                    <PersonalizeInsight />
                                </ErrorBoundary>
                            } 
                        />
                    </Routes>
                </Layout>
                <div className={`${isProfileOpen && 'lg:block hidden'}`}>
                    <Footer />
                </div>
            </ErrorBoundary>
        </Router>
    );
};

export default App;
