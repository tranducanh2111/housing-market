// src/pages/HomePage.js
import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center py-12 bg-blue-600 text-white w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
        <p className="text-lg mb-6">Your one-stop solution for all your needs!</p>
        <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-200">
          Get Started
        </button>
      </header>
      <section className="flex flex-col md:flex-row justify-around mt-12 space-y-8 md:space-y-0 md:space-x-8 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 1</h2>
          <p className="text-gray-700">Details about feature 1...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 2</h2>
          <p className="text-gray-700">Details about feature 2...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 3</h2>
          <p className="text-gray-700">Details about feature 3...</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;