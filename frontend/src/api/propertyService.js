// src/api/propertyService.js
import api from './config'; // Importing the configured axios instance for API requests

// Function to submit property data for prediction
export const submitPropertyData = async (formData) => {
    try {
        // Transforming the form data into the required format for the API
        const transformedData = {
            state: formData.state, // State of the property
            city: formData.city, // City of the property
            beds: parseInt(formData.bedrooms), // Number of bedrooms, converted to integer
            baths: parseFloat(formData.bathrooms), // Number of bathrooms, converted to float
            living_area: parseFloat(formData.livingArea), // Living area in square feet, converted to float
            land_area: parseFloat(formData.landSize), // Land area in square feet, converted to float
            sold: formData.soldStatus === 'sold', // Boolean indicating if the property is sold
            prev_sold_date: formData.soldStatus === 'sold' ? formData.lastSoldDate : null // Previous sold date if applicable
        };

        // Sending a POST request to the API with the transformed data
        const response = await api.post('/predict', transformedData);
        return response.data; // Returning the response data from the API
    } catch (error) {
        // Handling errors from the API response
        if (error.response?.data?.detail) {
            const errorDetail = error.response.data.detail[0];
            // Use the msg from the error detail
            throw new Error(errorDetail.msg); // Throwing a specific error message
        }
        if (error.response && error.response.status === 422) {
            throw new Error('Provided address is not supported'); // Handling unsupported address error
        }
        // Fallback for other errors
        throw new Error(error.response?.data?.detail || 'Failed to submit form'); // General error message
    }
};

// Function to submit address data for prediction
export const submitAddressData = async (formData) => {
    try {
        const { address: street, city, state } = formData; // Destructuring address data from formData
        
        // Sending a GET request to the API with the address parameters
        const response = await api.get(`/predict/${street}/${city}/${state}`);
        return response.data; // Returning the response data from the API
    } catch (error) {
        // Handling errors from the API response
        if (error.response?.data?.detail) {
            const errorDetail = error.response.data.detail[0];
            throw new Error(errorDetail.msg); // Throwing a specific error message
        }
        if (error.response && error.response.status === 422) {
            throw new Error('Provided address is not supported'); // Handling unsupported address error
        }
        throw new Error(error.response?.data?.detail || 'Failed to submit form'); // General error message
    }
};