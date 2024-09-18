// src/pages/HomePage.js
import React from 'react';
import HeroSection from '../page-sections/page-sections/HeroSection';

const HomePage = () => {
  return (
    <section className='flex flex-col items-center min-h-screen bg-white px-4'>
      <HeroSection />
    </section>
  );
};

export default HomePage;