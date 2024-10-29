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

        console.log('Transformed Data:', transformedData);

        const response = await api.post('/predict', transformedData);
        const result = response.data.result;

        // Handle the property details
        const propertyDetails = result['property-details'];
        displayPropertyDetails(propertyDetails);

        // Handle the choropleth chart data
        const choroplethData = result['choropleth-chart-data'];
        updateChoroplethChart(choroplethData);

        // Handle the bar chart data
        const barChartData = result['bar-chart-data'];
        updateBarChart(barChartData);

        // Handle the line chart data
        const lineChartData = response.data['line-chart-data'];
        updateLineChart(lineChartData);

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

// Function to display property details
const displayPropertyDetails = (details) => {
    // Update the UI with property details
    console.log('Property Details:', details);
    // You can update specific elements in your UI here
};

// Function to update the choropleth chart
const updateChoroplethChart = (data) => {
    console.log('Choropleth Chart Data:', data);
    // Implement the logic to update the choropleth chart
};

// Function to update the bar chart
const updateBarChart = (data) => {
    console.log('Bar Chart Data:', data);
    // Implement the logic to update the bar chart
};

// Function to update the line chart
const updateLineChart = (data) => {
    console.log('Line Chart Data:', data);
    // Implement the logic to update the line chart
};
