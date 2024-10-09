import React, { useRef, useEffect } from 'react';
import Button from './Button';
import PreviousArrowSvg from 'assets/icons/previous-arrow.svg';
import NextArrowSvg from 'assets/icons/next-arrow.svg';

const Tab = ({ categories, selectedCategoryIndex = -1, setSelectedCategoryIndex }) => {
    const filterButtonContainerRef = useRef(null);
    const selectedButtonRef = useRef(null);

    const handleNextCategory = () => {
        const nextIndex = (selectedCategoryIndex + 1) % categories.length;
        setSelectedCategoryIndex(nextIndex);
    };

    const handlePreviousCategory = () => {
        const previousIndex = (selectedCategoryIndex - 1 + categories.length) % categories.length;
        setSelectedCategoryIndex(previousIndex);
    };

    useEffect(() => {
        if (selectedButtonRef.current) {
            selectedButtonRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    }, [selectedCategoryIndex]);

    return (
        <div className={`w-full grid grid-cols-tab mt-1.5 gap-x-2 hide-scrollbar`}>
            <Button
                icon={PreviousArrowSvg}
                onClick={handlePreviousCategory}
                className="w-[2.875rem] hover:bg-secondary bg-primary"
            />
            <div
                className={`overflow-x-auto whitespace-nowrap space-x-2 flex items-center hide-scrollbar`}
                ref={filterButtonContainerRef}
            >
                <Button
                    title="All"
                    onClick={() => setSelectedCategoryIndex(-1)}
                    className={`h-[2.25rem] px-3 text-body-sm sm:text-body max-w-content border border-solid hover:opacity-70 ${selectedCategoryIndex === -1 ? 'text-primary bg-secondary border-primary' : 'text-[#000000] border-[#000000] opacity-50'}`}
                    ref={selectedCategoryIndex === -1 ? selectedButtonRef : null}
                />
                {categories.map((category, index) => (
                    <Button
                        key={category}
                        title={category}
                        onClick={() => setSelectedCategoryIndex(index)}
                        className={`h-[2.25rem] px-3 text-body-sm sm:text-body max-w-content border border-solid hover:opacity-70 ${selectedCategoryIndex === index ? 'text-primary bg-secondary border-primary' : 'text-[#000000] border-[#000000] opacity-50'}`}
                        ref={selectedCategoryIndex === index ? selectedButtonRef : null}
                    />
                ))}
            </div>
            <Button
                icon={NextArrowSvg}
                onClick={handleNextCategory}
                className="h-[2.25rem] w-[2.875rem] px-4 py-1.5 hover:bg-secondary bg-primary"
            />
        </div>
    );
};

export default Tab;
