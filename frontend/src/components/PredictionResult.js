import React from 'react';

const PredictionResult = ({ result }) => {
    if (!result) {
        return null; // Don't render anything if there's no result
    }

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-100">
            <h3 className="text-lg font-bold">Prediction Result</h3>
            <ul>
                <li><strong>State:</strong> {result['property-details'].state}</li>
                <li><strong>City:</strong> {result['property-details'].city}</li>
                <li><strong>Beds:</strong> {result['property-details'].beds}</li>
                <li><strong>Baths:</strong> {result['property-details'].baths}</li>
                <li><strong>Living Area:</strong> {result['property-details']['living-area']}</li>
                <li><strong>Land Area:</strong> {result['property-details']['land-area']}</li>
                <li><strong>Predicted Price:</strong> ${result.price.toFixed(2)}</li>
            </ul>
        </div>
    );
};

export default PredictionResult;

