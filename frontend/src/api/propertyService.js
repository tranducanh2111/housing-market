// src/api/propertyService.js
import api from './config';

export const submitPropertyData = async (formData) => {
    try {
        const transformedData = {
            state: formData.state,
            city: formData.city,
            beds: parseInt(formData.bedrooms),
            baths: parseFloat(formData.bathrooms),
            living_area: parseFloat(formData.livingArea),
            land_area: parseFloat(formData.landSize),
            sold: formData.soldStatus === 'sold',
            prev_sold_date: formData.soldStatus === 'sold' ? formData.lastSoldDate : null
        };

        const response = await api.post('/predict', transformedData);
        return response.data;
    } catch (error) {
        if (error.response?.data?.detail) {
            const errorDetail = error.response.data.detail[0];
            // Use the msg from the error detail
            throw new Error(errorDetail.msg);
        }
        if (error.response && error.response.status === 422) {
            throw new Error('Provided address is not supported');
        }
        // Fallback for other errors
        throw new Error(error.response?.data?.detail || 'Failed to submit form');
    }
};

export const submitAddressData = async (formData) => {
    try {
        const { address: street, city, state } = formData;
        
        const response = await api.get(`/predict/${street}/${city}/${state}`);
        return response.data;
    } catch (error) {
        if (error.response?.data?.detail) {
            const errorDetail = error.response.data.detail[0];
            throw new Error(errorDetail.msg);
        }
        if (error.response && error.response.status === 422) {
            throw new Error('Provided address is not supported');
        }
        throw new Error(error.response?.data?.detail || 'Failed to submit form');
    }
};
