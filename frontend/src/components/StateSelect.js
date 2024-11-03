import React, { useState, useRef, useEffect } from 'react';
import statesData from 'sample_data/us_state.json';

const StateSelect = ({ 
    value,
    onChange,
    error,
    label = "State",
    required = false,
    name = "state",
    onFocus
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Update searchTerm when value changes externally
    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    const filteredStates = statesData.states.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase()) &&
        state.toLowerCase() !== searchTerm.toLowerCase()
    );

    const handleStateSelect = (state) => {
        onChange({ target: { name, value: state } });
        setSearchTerm(state);
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
            setIsFocused(false);
        }
    };

    const handleContainerClick = () => {
        inputRef.current.focus();
    };

    const handleInputFocus = () => {
        setIsFocused(true);
        setIsOpen(true);
        if (onFocus) {
            onFocus(name);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!isOpen) {
                setIsFocused(false);
            }
        }, 200);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showDropdown = isOpen && filteredStates.length > 0;

    return (
        <div className="relative mb-8 cursor-text" ref={dropdownRef} onClick={handleContainerClick}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        // Trigger onChange with empty value to indicate field has been modified
                        onChange({ target: { name, value: '' } });
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleBlur}
                    className={`block w-full px-3 pt-6 pb-2 text-gray-900 bg-white border rounded-md appearance-none focus:outline-none focus:ring-0 peer ${
                        error
                            ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                            : 'border-gray-300 hover:border-primary focus:border-primary'
                    }`}
                    placeholder=" "
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
                <label
                    className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 
                        peer-placeholder-shown:scale-100 
                        peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 
                        peer-focus:-translate-y-3
                        ${error
                            ? 'text-red-500'
                            : isFocused ? 'text-primary' : 'text-gray-500'
                        }
                        ${searchTerm ? 'scale-75 -translate-y-3' : ''}
                        pointer-events-none
                    `}
                >
                    {label}{required && '*'}
                </label>
            </div>

            {showDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredStates.map((state) => (
                        <div
                            key={state}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleStateSelect(state)}
                        >
                            {state}
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div 
                    id={`${name}-error`}
                    className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};

export default StateSelect;