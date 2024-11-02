/* eslint-disable */
// src/pages/HomePage.js
import React from 'react';
import HeroSection from 'page-sections/Homepage/HeroSection';
import TestimonialSection from 'page-sections/Homepage/TestimonialSection';
import SponsorList from 'page-sections/Homepage/SponsorList';
import ContactSection from 'page-sections/Homepage/ContactFormSection';
import ErrorBoundary from 'components/ultility/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';

const HomePageContent = () => {
    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24">
            <HeroSection />
            <TestimonialSection />
            <SponsorList />
            <ContactSection />
        </section>
    );
};

const HomePage = () => {
    return (
        <ErrorBoundary>
            <HomePageContent />
        </ErrorBoundary>
    );
};

export default withErrorBoundary(HomePage);