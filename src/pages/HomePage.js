// src/pages/HomePage.js
import React from 'react';
import HeroSection from 'page-sections/Homepage/HeroSection';
import ServiceSection from 'page-sections/Homepage/ServiceSection';
import TestimonialSection from 'page-sections/Homepage/TestimonialSection';
const HomePage = () => {
  return (
    <section className='max-w-[78rem] mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24'>
      <HeroSection />
      <ServiceSection />
      <TestimonialSection />
    </section>
  );
};

export default HomePage;