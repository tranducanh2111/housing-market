// src/pages/HomePage.js
import React from 'react';
import HeroSection from 'page-sections/Homepage/HeroSection';
import ServiceSection from 'page-sections/Homepage/ServiceSection';
import TestimonialSection from 'page-sections/Homepage/TestimonialSection';
import SponsorList from 'page-sections/Homepage/SponsorList';
import ContactSection from 'page-sections/Homepage/ContactFormSection';
const HomePage = () => {
  return (
    <section className='mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24'>
      <HeroSection />
      <ServiceSection />
      <TestimonialSection />
      <SponsorList />
      <ContactSection />
    </section>
  );
};

export default HomePage;