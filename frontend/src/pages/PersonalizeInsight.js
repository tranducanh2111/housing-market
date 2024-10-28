// src/pages/PersonalizeInsight.js
/* eslint-disable */
import React, { useState } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';
import { submitPropertyData } from '../api/propertyService';
import PredictionResult from '../components/PredictionResult';

const PersonalizeInsightContent = () => {
    const [formData, setFormData] = useState({
        address: '',
        state: '',
        city: '',
        bedrooms: '',
        bathrooms: '',
        livingArea: '',
        landSize: '',
        lastSoldDate: '',
        soldStatus: 'sold'
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null); // State to hold the prediction result

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setError(null);
    };

    const validateForm = () => {
        const requiredFields = ['address', 'state', 'city', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        
        if (emptyFields.length > 0) {
            throw new Error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
        }

        if (formData.soldStatus === 'sold' && !formData.lastSoldDate) {
            throw new Error('Please provide the last sold date');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setResult(null); // Reset result on new submission

        try {
            validateForm();
            const predictionResult = await submitPropertyData(formData);
            console.log('Prediction Result:', predictionResult); // Log the result
            setResult(predictionResult); // Set the result state
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24 p-4 md:p-8">
            <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Property Information</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {['address', 'state', 'city', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'].map((field, index) => (
                    <input
                        key={index}
                        type={field === 'state' || field === 'city' || field === 'address' ? 'text' : 'number'}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                ))}

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="soldStatus"
                        checked={formData.soldStatus === 'not_sold'}
                        onChange={(e) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                soldStatus: e.target.checked ? 'not_sold' : 'sold'
                            }));
                        }}
                        className="mr-2"
                    />
                    <label className="text-body-sm sm:text-body">Not sold yet</label>
                </div>

                <input
                    type="date"
                    name="lastSoldDate"
                    value={formData.lastSoldDate}
                    onChange={handleChange}
                    disabled={formData.soldStatus === 'not_sold'} // Disable if not sold
                    className={`w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary ${formData.soldStatus === 'not_sold' ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                />

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`bg-primary text-white p-2 rounded w-full hover:bg-primary-dark transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                {/* Can try to uncomment this to test error boundary */}
                {/* <button type="button" onClick={throwError} className="mt-4 bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 transition duration-200">
                    Throw Error
                </button> */}
            </form>

            {/* Display the prediction result if available */}
            <PredictionResult result={result} />
        </section>
    );
};

const PersonalizeInsight = () => {
    return (
        <ErrorBoundary>
            <PersonalizeInsightContent />
        </ErrorBoundary>
    );
};

export default withErrorBoundary(PersonalizeInsight);
