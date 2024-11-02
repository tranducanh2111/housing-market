// src/components/StateSelect.js
import React, { useState, useRef, useEffect } from 'react';
import statesData from 'sample_data/us_state.json'; // Importing state data from a JSON file

// Functional component for selecting a state
const StateSelect = ({ 
    value, // Current selected value
    onChange, // Function to call when the selected value changes
    error, // Error message to display if applicable
    label = "State", // Label for the input field
    required = true, // Indicates if the field is required
    name = "state" // Name attribute for the input field
}) => {
    // State variables for managing component behavior
    const [isFocused, setIsFocused] = useState(false); // Tracks if the input is focused
    const [touched, setTouched] = useState(false); // Tracks if the input has been interacted with
    const [searchTerm, setSearchTerm] = useState(''); // Stores the current search term
    const [isOpen, setIsOpen] = useState(false); // Tracks if the dropdown is open
    const dropdownRef = useRef(null); // Ref for the dropdown container
    const inputRef = useRef(null); // Ref for the input field

    // Filtering states based on the search term
    const filteredStates = statesData.states.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase()) && // Matches search term
        state.toLowerCase() !== searchTerm.toLowerCase() // Excludes exact matches
    );

    // Function to handle state selection
    const handleStateSelect = (state) => {
        onChange({ target: { name, value: state } }); // Call onChange with the selected state
        setSearchTerm(state); // Update the search term to the selected state
        setIsOpen(false); // Close the dropdown
        setTouched(true); // Mark the input as touched
        setIsFocused(false); // Remove focus from the input
        inputRef.current?.blur(); // Blur the input field
    };

    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false); // Close the dropdown
            setTouched(true); // Mark the input as touched
            setIsFocused(false); // Remove focus from the input
        }
    };

    // Function to handle clicks on the container
    const handleContainerClick = () => {
        inputRef.current.focus(); // Focus the input field when the container is clicked
    };

    // Function to handle input blur event
    const handleBlur = () => {
        setTimeout(() => {
            if (!isOpen) {
                setIsFocused(false); // Remove focus if the dropdown is not open
                setTouched(true); // Mark the input as touched
            }
        }, 200); // Delay to allow dropdown to close
    };

    // Effect to handle clicks outside the component
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // Add event listener for clicks
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Cleanup on unmount
        };
    }, []);

    // Determine if the dropdown should be shown
    const showDropdown = isOpen && filteredStates.length > 0;

    // Determine if there is an error to display
    const showError = touched && required && !searchTerm;
    const errorMessage = error || (showError ? `${label} is required` : ''); // Construct error message

    return (
        <div className="relative mb-8 cursor-text" ref={dropdownRef} onClick={handleContainerClick}>
            <div className="relative">
                <input
                    ref={inputRef} // Reference to the input field
                    type="text"
                    name={name} // Name attribute for the input
                    value={searchTerm} // Current value of the input
                    onChange={(e) => {
                        setSearchTerm(e.target.value); // Update search term on input change
                        setIsOpen(true); // Open the dropdown
                    }}
                    onFocus={() => {
                        setIsFocused(true); // Set focus state
                        setIsOpen(true); // Open the dropdown on focus
                    }}
                    onBlur={handleBlur} // Handle blur event
                    className={`block w-full px-3 pt-6 pb-2 text-gray-900 bg-white border rounded-md appearance-none focus:outline-none focus:ring-0 peer ${
                        errorMessage
                            ? 'border-red-500 hover:border-red-500 focus:border-red-500' // Error styling
                            : 'border-gray-300 hover:border-primary focus:border-primary' // Default styling
                    }`}
                    placeholder=" " // Placeholder for the input
                    required={required} // Required attribute
                    aria-invalid={!!errorMessage} // Accessibility attribute for error
                    aria-describedby={errorMessage ? `${name}-error` : undefined} // Accessibility for error message
                />
                <label
                    className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 
                        peer-placeholder-shown:scale-100 
                        peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 
                        peer-focus:-translate-y-3
                        ${errorMessage 
                            ? 'text-red-500' // Error label color
                            : isFocused ? 'text-primary' : 'text-gray-500' // Default label color
                        }
                        ${searchTerm ? 'scale-75 -translate-y-3' : ''} // Adjust label position based on input value
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
                            key={state} // Unique key for each state option
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" // Styling for each option
                            onClick={() => handleStateSelect(state)} // Handle state selection
                        >
                            {state}
                        </div>
                    ))}
                </div>
            )}

            {errorMessage && (
                <div 
                    id={`${name}-error`} // ID for accessibility
                    className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1" // Styling for error message
                    role="alert" // Accessibility role for alert
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

export default StateSelect; // Exporting the StateSelect component for use in other parts of the application