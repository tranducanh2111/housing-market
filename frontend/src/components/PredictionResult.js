import React from 'react';

const PredictionResult = ({ result }) => {
    if (!result || !result.result) {
        return null; // Don't render anything if there's no result
    }

    const propertyDetails = result.result['property-details'];
    const predictionPrice = result.result.prediction;

    try {
        return (
            <div className="mt-4 p-4 h-fit w-full border border-gray-300 rounded bg-gray-100">
                <h3 className="text-lg font-bold">Prediction Result</h3>
                <ul>
                    <li><p className='text-body-sm sm:text-body'><strong>State:</strong> {propertyDetails.state}</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>City:</strong> {propertyDetails.city}</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>Beds:</strong> {propertyDetails.beds}</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>Baths:</strong> {propertyDetails.baths}</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>Living Area:</strong> {propertyDetails['living-area'].toFixed(2)} m²</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>Land Area:</strong> {propertyDetails['land-area'].toFixed(2)} m²</p></li>
                    <li><p className='text-body-sm sm:text-body'><strong>Predicted Price:</strong> ${predictionPrice?.toFixed(2) || 'N/A'}</p></li>
                    {/* Debug information */}
                    {/* <li className="mt-4 pt-4 border-t border-gray-300">
                        <strong>Full Response:</strong>
                        <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto text-xs">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </li> */}
                </ul>
            </div>
        );
    } catch (error) {
        console.error("Error rendering prediction result:", error);
        return (
            <div className="mt-4 p-4 border border-red-500 rounded bg-red-100">
                <h3 className="text-h3-sm sm:text-h3 font-bold text-red-600">Error</h3>
                <p className="text-red-600 text-body-sm sm:text-body">An error occurred while displaying the prediction result. Please try again later.</p>
            </div>
        );
    }
};

export default PredictionResult;
