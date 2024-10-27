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
            prev_sold_date: formData.soldStatus === 'sold' ? formData.lastSoldDate : null
        };

        const response = await api.post('/predict', transformedData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to submit form');
    }
};