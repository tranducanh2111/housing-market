import React from 'react';

const PredictionResult = ({ result }) => {
    if (!result || !result.result) {
        return null; // Don't render anything if there's no result
    }

    const propertyDetails = result.result['property-details'];

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-100">
            <h3 className="text-lg font-bold">Prediction Result</h3>
            <ul>
                <li><strong>State:</strong> {propertyDetails.state}</li>
                <li><strong>City:</strong> {propertyDetails.city}</li>
                <li><strong>Beds:</strong> {propertyDetails.beds}</li>
                <li><strong>Baths:</strong> {propertyDetails.baths}</li>
                <li><strong>Living Area:</strong> {propertyDetails['living-area']} m²</li>
                <li><strong>Land Area:</strong> {propertyDetails['land-area']} m²</li>
                <li><strong>Predicted Price:</strong> ${propertyDetails.price?.toFixed(2) || 'N/A'}</li>
                {/* Debug information */}
                <li className="mt-4 pt-4 border-t border-gray-300">
                    <strong>Full Response:</strong>
                    <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto text-xs">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </li>
            </ul>
        </div>
    );
};

export default PredictionResult;
