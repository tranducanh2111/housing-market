// src/pages/HomePage.js
import React from 'react';
import HeroSection from '../page-sections/Homepage/HeroSection';
import ServiceSection from '../page-sections/Homepage/ServiceSection';

const HomePage = () => {
  return (
    <section className='flex flex-col items-center min-h-screen bg-white px-4 gap-y-24'>
      <HeroSection />
      <ServiceSection />
    </section>
  );
};

export default HomePage;