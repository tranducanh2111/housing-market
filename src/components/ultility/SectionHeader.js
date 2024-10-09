// src/ultility/SectionHeader.js
import React from 'react';
import Tab from './Tab';
import Button from 'components/ultility/Button';
import ThinArrow from 'assets/icons/thin-arrow.svg';

// Define the HeadingSection component
const SectionHeader = ({
    headingText,
    paragraphText,
    viewMoreLink,
    showFilterBar,
    categories,
    selectedCategoryIndex,
    setSelectedCategoryIndex,
}) => {
    return (
        <div className="mb-6 w-full flex flex-col flex-wrap md:flex-row justify-between items-center space-y-3">
            <div className="w-full sm:max-w-[40rem] space-y-3">
                <h2 className="text-h2-sm sm:text-h2 mb-1 max-w-[26.125rem] font-bold">
                    {headingText}
                </h2>
                <p className="text-body-sm sm:text-body text-grey line-[22px] max-w-[40rem]">
                    {paragraphText}
                </p>
                {/* Conditionally render FilterBar */}
                {showFilterBar && (
                    <Tab
                        categories={categories}
                        selectedCategoryIndex={selectedCategoryIndex}
                        setSelectedCategoryIndex={setSelectedCategoryIndex}
                    />
                )}
            </div>
            {/* View More button */}
            <a
                href={viewMoreLink}
                className="flex items-center max-w-content h-8 text-primary px-1 py-1 rounded-sm ml-auto hover:scale-[1.1] transition duration-200 ease-in-out"
            >
                <Button className="text-primary" icon={ThinArrow} title="View more" />
            </a>
        </div>
    );
};

export default SectionHeader;
