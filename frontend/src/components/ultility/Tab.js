import React, { useRef, useEffect } from 'react';
import Button from './Button';
import PreviousArrowSvg from 'assets/icons/previous-arrow.svg';
import NextArrowSvg from 'assets/icons/next-arrow.svg';

// Tab component for selecting categories
const Tab = ({ 
    categories,                     // Array of category names
    selectedCategoryIndex = -1,     // Index of the currently selected category (default is -1 for "All")
    setSelectedCategoryIndex        // Function to update the selected category index
}) => {
    // Reference to the container of the filter buttons for scrolling purposes
    const filterButtonContainerRef = useRef(null);
    // Reference to the currently selected button for scrolling into view
    const selectedButtonRef = useRef(null);

    // Handler function to select the next category
    const handleNextCategory = () => {
        const nextIndex = (selectedCategoryIndex + 1) % categories.length; // Calculate next index (wrap around)
        setSelectedCategoryIndex(nextIndex); // Update selected category index
    };

    // Handler function to select the previous category
    const handlePreviousCategory = () => {
        const previousIndex = (selectedCategoryIndex - 1 + categories.length) % categories.length; // Calculate previous index (wrap around)
        setSelectedCategoryIndex(previousIndex); // Update selected category index
    };

    // Effect to scroll the selected button into view whenever the selected category changes
    useEffect(() => {
        if (selectedButtonRef.current) {
            selectedButtonRef.current.scrollIntoView({
                behavior: 'smooth', // Smooth scrolling effect
                block: 'nearest',    // Align to nearest block edge
                inline: 'nearest',   // Align to nearest inline edge
            });
        }
    }, [selectedCategoryIndex]); // Dependency on selectedCategoryIndex

    return (
        <div className={`w-full grid grid-cols-tab mt-1.5 gap-x-2 hide-scrollbar`}>
            {/* Button to navigate to the previous category */}
            <Button
                icon={PreviousArrowSvg}
                onClick={handlePreviousCategory}
                className="w-[2.875rem] hover:bg-secondary bg-primary"
            />
            <div
                className={`overflow-x-auto whitespace-nowrap space-x-2 flex items-center hide-scrollbar`}
                ref={filterButtonContainerRef} // Attach ref for scrolling
            >
                {/* Button for the "All" category */}
                <Button
                    title="All"
                    onClick={() => setSelectedCategoryIndex(-1)} // Set index to -1 for "All"
                    className={`h-[2.25rem] px-3 text-body-sm sm:text-body max-w-content border border-solid hover:opacity-70 ${selectedCategoryIndex === -1 ? 'text-primary bg-secondary border-primary' : 'text-[#000000] border-[#000000] opacity-50'}`}
                    ref={selectedCategoryIndex === -1 ? selectedButtonRef : null} // Attach ref if selected
                />
                {/* Map through categories to create buttons for each */}
                {categories.map((category, index) => (
                    <Button
                        key={category} // Unique key for each button
                        title={category} // Category name as button title
                        onClick={() => setSelectedCategoryIndex(index)} // Update selected category index
                        className={`h-[2.25rem] px-3 text-body-sm sm:text-body max-w-content border border-solid hover:opacity-70 ${selectedCategoryIndex === index ? 'text-primary bg-secondary border-primary' : 'text-[#000000] border-[#000000] opacity-50'}`}
                        ref={selectedCategoryIndex === index ? selectedButtonRef : null} // Attach ref if selected
                    />
                ))}
            </div>
            {/* Button to navigate to the next category */}
            <Button
                icon={NextArrowSvg}
                onClick={handleNextCategory}
                className="h-[2.25rem] w-[2.875rem] px-4 py-1.5 hover:bg-secondary bg-primary"
            />
        </div>
    );
};

export default Tab;
