// src/ultility/SectionHeader.js
import React from 'react';
import Tab from './Tab'; // Import the Tab component for category filtering
import Button from 'components/ultility/Button'; // Import custom Button component
import ThinArrow from 'assets/icons/thin-arrow.svg'; // Import arrow icon for the button

// Define the SectionHeader component
const SectionHeader = ({
    headingText, // Text for the section heading
    paragraphText, // Text for the section paragraph
    viewMoreLink, // Link for the "View More" button
    showFilterBar, // Boolean to determine if the filter bar should be displayed
    categories, // Array of categories for the filter tab
    selectedCategoryIndex, // Index of the currently selected category
    setSelectedCategoryIndex, // Function to update the selected category index
}) => {
    return (
        <div className="mb-6 w-full flex flex-col flex-wrap md:flex-row justify-between items-center space-y-3">
            <div className="w-full sm:max-w-[40rem] space-y-3">
                <h2 className="text-h2-sm sm:text-h2 mb-1 max-w-[26.125rem] font-bold">
                    {headingText} {/* Render the section heading */}
                </h2>
                <p className="text-body-sm sm:text-body text-grey line-[22px] max-w-[40rem]">
                    {paragraphText} {/* Render the section paragraph */}
                </p>
                {/* Conditionally render the FilterBar (Tab component) */}
                {showFilterBar && (
                    <Tab
                        categories={categories} // Pass categories to Tab
                        selectedCategoryIndex={selectedCategoryIndex} // Pass selected category index
                        setSelectedCategoryIndex={setSelectedCategoryIndex} // Pass function to update selected index
                    />
                )}
            </div>
            {/* View More button */}
            <a
                href={viewMoreLink} // Link for the View More button
                className="flex items-center max-w-content h-8 text-primary px-1 py-1 rounded-sm ml-auto hover:scale-[1.1] transition duration-200 ease-in-out"
            >
                <Button className="text-primary" icon={ThinArrow} title="View more" /> {/* Button with icon and title */}
            </a>
        </div>
    );
};

export default SectionHeader;
