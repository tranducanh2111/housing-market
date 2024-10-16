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
        lastSoldDate: ''
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
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24">
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="number"
                    name="bedrooms"
                    placeholder="Number of Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="number"
                    name="bathrooms"
                    placeholder="Number of Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="number"
                    name="livingArea"
                    placeholder="Living Area Size (m²)"
                    value={formData.livingArea}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="number"
                    name="landSize"
                    placeholder="Land Size (m²)"
                    value={formData.landSize}
                    onChange={handleChange}
                    // required
                />
                <input
                    type="date"
                    name="lastSoldDate"
                    value={formData.lastSoldDate}
                    onChange={handleChange}
                    // required
                />
                <button type="submit" className="bg-primary text-white p-2 rounded">
                    Submit
                </button>
            </form>
        </section>
    );
};

export default PersonalizeInsight;
