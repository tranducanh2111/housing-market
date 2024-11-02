/**
 * Main Application Component
 * 
 * This is the root component of the React application that handles routing and layout structure.
 * It implements a responsive layout with sidebar navigation and profile panel functionality.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layout components for the application structure
import Navbar from 'components/layout/Navbar';
import Layout from 'components/layout/Layout';
import Footer from 'components/layout/Footer';

// Page components for different routes
import HomePage from 'pages/HomePage';
import LatestResearch from 'pages/LatestResearch';
import PersonalizeInsight from 'pages/PersonalizeInsight';
import ResultDashboard from 'pages/ResultDashboard';

// Import Swiper styles for carousel/slider functionality
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Error boundary component for handling runtime errors
import ErrorBoundary from 'components/ultility/ErrorBoundary';

/**
 * App Component
 * 
 * Manages the application's layout state and routing configuration.
 * Implements sidebar and profile panel functionality with corresponding state management.
 */
const App = () => {
    // State for controlling sidebar visibility
    const [isOpen, setIsOpen] = React.useState(false);
    // State for controlling profile panel visibility
    const [isProfileOpen, setProfileIsOpen] = React.useState(false);

    /**
     * Opens the sidebar navigation
     */
    const openSidebar = () => {
        setIsOpen(true);
    };

    /**
     * Closes the sidebar navigation
     */
    const closeSidebar = () => {
        setIsOpen(false);
    };

    /**
     * Closes the profile panel
     */
    const closeProfile = () => {
        setProfileIsOpen(false);
    };

    /**
     * Toggles the profile panel visibility
     */
    const toggleProfile = () => {
        setProfileIsOpen(!isProfileOpen);
    };

    return (
        <Router>
            {/* Top-level error boundary to catch any unhandled errors */}
            <ErrorBoundary>
                {/* Navigation bar with sidebar and profile controls */}
                <Navbar openSidebar={openSidebar} toggleProfile={toggleProfile} />
                
                {/* Main layout wrapper that manages sidebar and profile panel state */}
                <Layout
                    isOpen={isOpen}
                    isProfileOpen={isProfileOpen}
                    openSidebar={openSidebar}
                    closeSidebar={closeSidebar}
                    closeProfile={closeProfile}
                >
                    {/* Application routes configuration */}
                    <Routes>
                        {/* Homepage route */}
                        <Route 
                            path="/" 
                            element={
                                <ErrorBoundary>
                                    <HomePage />
                                </ErrorBoundary>
                            } 
                        />
                        
                        {/* Latest research page route */}
                        <Route 
                            path="/latest-research" 
                            element={
                                <ErrorBoundary>
                                    <LatestResearch />
                                </ErrorBoundary>
                            } 
                        />
                        
                        {/* Personalized insights page route */}
                        <Route 
                            path="/personalize-insight"
                            element={
                                <ErrorBoundary>
                                    <PersonalizeInsight />
                                </ErrorBoundary>
                            } 
                        />
                        
                        {/* Results dashboard page route */}
                        <Route 
                            path="/result-dashboard" 
                            element={
                                <ErrorBoundary>
                                    <ResultDashboard />
                                </ErrorBoundary>
                            } 
                        />
                    </Routes>
                </Layout>
                
                {/* Footer component with responsive visibility based on profile panel state */}
                <div className={`${isProfileOpen && 'lg:block hidden'}`}>
                    <Footer />
                </div>
            </ErrorBoundary>
        </Router>
    );
};

export default App;