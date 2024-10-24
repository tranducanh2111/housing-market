// src/pages/PersonalizeInsight.js
import React, { useState } from 'react';

const PersonalizeInsight = () => {
    const [formData, setFormData] = useState({
        state: '',
        city: '',
        bedrooms: '',
        bathrooms: '',
        livingArea: '',
        landSize: '',
        lastSoldDate: '',
        soldStatus: 'sold' // New state to track sold status
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            lastSoldDate: formData.soldStatus === 'not_sold' ? new Date().toISOString().split('T')[0] : formData.lastSoldDate
        };
        console.log(submissionData);
    };

    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24 p-4 md:p-8">
            <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Property Information</h2>
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="number"
                    name="bedrooms"
                    placeholder="Number of Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="number"
                    name="bathrooms"
                    placeholder="Number of Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="number"
                    name="livingArea"
                    placeholder="Living Area Size (m²)"
                    value={formData.livingArea}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="number"
                    name="landSize"
                    placeholder="Land Size (m²)"
                    value={formData.landSize}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="soldStatus"
                        checked={formData.soldStatus === 'not_sold'}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                soldStatus: e.target.checked ? 'not_sold' : 'sold'
                            });
                        }}
                        className="mr-2"
                    />
                    <label className="text-body-sm sm:text-body">
                        Not sold yet
                    </label>
                </div>
                <input
                    type="date"
                    name="lastSoldDate"
                    value={formData.lastSoldDate}
                    onChange={handleChange}
                    disabled={formData.soldStatus === 'not_sold'} // Disable if not sold
                    className={`w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary ${formData.soldStatus === 'not_sold' ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                />
                <button type="submit" className="bg-primary text-white p-2 rounded w-full hover:bg-primary-dark transition duration-200">
                    Submit
                </button>
            </form>
        </section>
    );
};

export default PersonalizeInsight;
