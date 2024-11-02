// src/api/config.js
import axios from 'axios'; // Importing the axios library for making HTTP requests

const API_BASE_URL = 'http://127.0.0.1:8000'; // Your FastAPI backend URL

// Creating an axios instance with a predefined base URL and headers
const api = axios.create({
    baseURL: API_BASE_URL, // Base URL for all API requests
    headers: {
        'Content-Type': 'application/json', // Setting the content type to JSON
    },
});

export default api; // Exporting the axios instance for use in other parts of the application