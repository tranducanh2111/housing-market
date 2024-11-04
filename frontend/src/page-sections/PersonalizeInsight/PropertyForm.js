import React, { useState } from 'react';
import { submitPropertyData, submitAddressData } from 'api/propertyService';
import FormInput from 'components/ultility/FormInput';
import StateSelect from 'components/StateSelect';
import InfoIcon from 'assets/icons/info.svg';

const PropertyForm = ({ onSubmitSuccess }) => {
    const [formType, setFormType] = useState('details');
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
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        
        // Clear error for this field if form has been submitted once
        if (hasAttemptedSubmit) {
            setErrorMessages((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleInputFocus = (fieldName) => {
        if (hasAttemptedSubmit) {
            setErrorMessages((prev) => ({
                ...prev,
                [fieldName]: ''
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = formType === 'address' 
            ? ['address', 'city', 'state']
            : ['city', 'state', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'];
        
        const messages = {};
        let hasErrors = false;
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                const fieldName = field.charAt(0).toUpperCase() + 
                    field.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase();
                messages[field] = `${fieldName} is required`;
                hasErrors = true;
            }
        });

        setErrorMessages(messages);
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasAttemptedSubmit(true);
        setIsSubmitting(true);
        setError(null);

        const isValid = validateForm();
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        try {
            const submitFunction = formType === 'address' ? submitAddressData : submitPropertyData;
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
                        touched={hasAttemptedSubmit} // Pass the form submission state
                        onFocus={() => handleInputFocus(field)}
                        name="state"
                        label="State"
                        required={true}
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
                        required={true}
                        error={errorMessages[field]}
                        onFocus={handleInputFocus}
                    />
                </div>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg h-fit" noValidate>
            <div className="mb-8">
                <div className="flex justify-between bg-gray-100 p-1 rounded-lg">
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
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                {formType === 'address' ? 'Property Address' : 'Property Details'}
                <span className="relative inline-block ml-2 cursor-pointer group">
                    <img src={InfoIcon} alt="info" className="w-4 h-4" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-40 p-2 bg-gray-700 text-white text-footnote-sm sm:text-footnote rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
                        Only US addresses are supported.
                    </div>
                </span>
            </h2>
            
            {error && (
                <div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-600 rounded-md">
                    {error}
                </div>
            )}

            {formType === 'address' 
                ? renderInputs(['address', 'state', 'city'])
                : (
                    <>
                        {renderInputs(['city', 'state', 'bedrooms', 'bathrooms', 'livingArea', 'landSize'])}
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