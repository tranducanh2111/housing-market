import React, { useState, useRef } from 'react';

const FormInput = ({ 
    type = 'text', 
    name, 
    value, 
    onChange, 
    label,
    required = false 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const handleContainerClick = () => {
        inputRef.current.focus();
    };

    return (
        <div 
            className="relative mb-4 cursor-text" 
            onClick={handleContainerClick}
        >
            <input
                ref={inputRef}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="block w-full px-3 pt-6 pb-2 text-gray-900 bg-white border rounded-md appearance-none focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required={required}
            />
            <label
                className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75 
                    peer-focus:-translate-y-3
                    ${isFocused ? 'text-primary' : 'text-gray-500'}
                    ${value ? 'scale-75 -translate-y-3' : ''}
                    pointer-events-none
                `}
            >
                {label}
            </label>
        </div>
    );
};

export default FormInput;
