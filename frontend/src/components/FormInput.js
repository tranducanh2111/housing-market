import React, { useState, useRef } from 'react';

const FormInput = ({ 
    type = 'text', 
    name, 
    value, 
    onChange, 
    label,
    required = false,
    error
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const inputRef = useRef(null);

    const handleContainerClick = () => {
        inputRef.current.focus();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setTouched(true);
    };

    const showError = touched && required && !value;
    const errorMessage = error || (showError ? `${label} is required` : '');

    return (
        <div className="relative mb-8 cursor-text" onClick={handleContainerClick}>
            <input
                ref={inputRef}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                className={`block w-full px-3 pt-6 pb-2 text-gray-900 bg-white border rounded-md appearance-none focus:outline-none focus:ring-0 peer ${
                    errorMessage
                        ? 'border-red-500 hover:border-red-500 focus:border-red-500' 
                        : 'border-gray-300 hover:border-primary focus:border-primary'
                } ${type === 'number' ? 'no-spinner' : ''}`}
                placeholder=" "
                required={required}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? `${name}-error` : undefined}
            />
            <label
                className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75 
                    peer-focus:-translate-y-3
                    ${errorMessage
                        ? 'text-red-500' 
                        : isFocused ? 'text-primary' : 'text-gray-500'
                    }
                    ${value ? 'scale-75 -translate-y-3' : ''}
                    pointer-events-none
                `}
            >
                {label}{required && '*'}
            </label>
            {errorMessage && (
                <div 
                    id={`${name}-error`}
                    className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default FormInput;
