import React, { useState } from 'react';
import { submitPropertyData, submitAddressData } from '../../api/propertyService';
import FormInput from '../../components/FormInput';
import StateSelect from '../../components/StateSelect';

const PropertyForm = ({ onSubmitSuccess }) => {
    const [formType, setFormType] = useState('address'); // 'address' or 'details'
    const [formData, setFormData] = useState({
        address: '',
        state: '',
        city: '',
        bedrooms: '',
        bathrooms: '',
        livingArea: '',
        landSize: '',
        lastSoldDate: '',
        soldStatus: 'not_sold'
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setError(null);
    };

    const validateForm = () => {
        const requiredFields = formType === 'address' 
            ? ['address', 'city', 'state']
            : ['city', 'state', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'];
        
        const emptyFields = requiredFields.filter(field => !formData[field]);
        
        if (emptyFields.length > 0) {
            const messages = {};
            emptyFields.forEach(field => {
                messages[field] = `Please enter your ${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`;
            });
            setErrorMessages(messages);
            throw new Error('Please fill in all required fields');
        } else {
            setErrorMessages({});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            validateForm();
            const submitFunction = formType === 'address' ? submitAddressData : submitPropertyData;

            // Debugging output for the endpoint
            if (formType === 'address') {
                const { address: street, city, state } = formData;
                const endpoint = `/predict/${street}/${city}/${state}`;
                console.log(`Method: GET, Endpoint: ${endpoint}`);
            } else {
                console.log('Method: POST, Endpoint: /predict');
            }

            const predictionResult = await submitFunction(formData);
            onSubmitSuccess(predictionResult);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInputs = (fields) => {
        return fields.map((field) => {
            if (field === 'state') {
                return (
                    <StateSelect
                        key={field}
                        value={formData[field]}
                        onChange={handleChange}
                        error={errorMessages[field]}
                    />
                );
            }
            return (
                <div key={field} className="relative">
                    <FormInput
                        type={field === 'city' || field === 'address' ? 'text' : 'number'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        required
                        error={errorMessages[field]}
                    />
                </div>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg h-fit">
            <div className="mb-8">
                <div className="flex justify-between bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                            formType === 'address' 
                                ? 'bg-white shadow-md text-primary' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setFormType('address')}
                    >
                        By Address
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                            formType === 'details' 
                                ? 'bg-white shadow-md text-primary' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setFormType('details')}
                    >
                        By Details
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                {formType === 'address' ? 'Property Address' : 'Property Details'}
            </h2>
            
            {error && (
                <div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-600 rounded-md">
                    {error}
                </div>
            )}
            {Object.keys(errorMessages).map((field) => (
                <div key={field} className="mb-2 p-2 border border-red-500 bg-red-50 text-red-600 rounded-md">
                    {errorMessages[field]}
                </div>
            ))}

            {formType === 'address' 
                ? renderInputs(['address', 'state', 'city'])
                : (
                    <>
                        {renderInputs(['state', 'city', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'])}
                        <div className="flex items-center mb-6 mt-2">
                            <input
                                type="checkbox"
                                name="soldStatus"
                                checked={formData.soldStatus === 'sold'}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        soldStatus: e.target.checked ? 'sold' : 'not_sold'
                                    }));
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                                Property has been sold
                            </label>
                        </div>

                        {formData.soldStatus === 'sold' && (
                            <FormInput
                                type="date"
                                name="lastSoldDate"
                                value={formData.lastSoldDate}
                                onChange={handleChange}
                                label="Sold Date"
                            />
                        )}
                    </>
                )
            }

            <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full mt-6 py-3 px-4 bg-primary text-white rounded-md transition-all duration-200
                    ${isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-secondary hover:shadow-lg'
                    }`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default PropertyForm;