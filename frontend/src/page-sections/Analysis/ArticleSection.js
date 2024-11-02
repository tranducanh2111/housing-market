import React, { useState, useEffect } from 'react';
import testOverviewData from '../../sample_data/testOverview.json'; // Adjust path accordingly
import HeadingSection from 'components/ultility/SectionHeader'; // Adjust path accordingly
import BlogCard from 'components/ultility/BlogCard'; // Adjust path accordingly
import property1 from '../../assets/images/property1.jpg';
import property2 from '../../assets/images/property2.jpg';
import property3 from '../../assets/images/property3.jpg';
import property4 from '../../assets/images/property4.jpg';
import property5 from '../../assets/images/property5.jpg';
import property7 from '../../assets/images/property7.jpg';
import property8 from '../../assets/images/property8.jpg';
import property9 from '../../assets/images/property9.jpg';
import property10 from '../../assets/images/property10.jpg';
import property11 from '../../assets/images/property11.jpg';
import property12 from '../../assets/images/property12.jpg';
import property13 from '../../assets/images/property13.jpg';
import property14 from '../../assets/images/property14.jpg';
import property15 from '../../assets/images/property15.jpg';
import property16 from '../../assets/images/property16.jpg';
import property17 from '../../assets/images/property17.jpg';
import property18 from '../../assets/images/property18.jpg';
import property19 from '../../assets/images/property19.jpg';
import property20 from '../../assets/images/property20.jpg';
import property6 from '../../assets/images/property6.jpg';

const ArticleSection = ({ sectionName, description, viewMoreLink, showFilter }) => {
    const testOverview = testOverviewData;
    const categories = Object.keys(testOverview);

    // Pagination variables
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);

    // Filter variables
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [filteredData, setFilteredData] = useState([]);

    // Calculate the range of items to display on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Handle page change
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    useEffect(() => {
        // Initialize filtered data when the component mounts
        const selectedCategory = categories[selectedCategoryIndex];
        const filteredPeople = selectedCategory
            ? testOverview[selectedCategory]
            : Object.values(testOverview).flat();
        setFilteredData(filteredPeople);
    }, [selectedCategoryIndex, categories]);

    const imageMapping = {
        "property1.jpg": property1,
        "property2.jpg": property2,
        "property3.jpg": property3,
        "property4.jpg": property4,
        "property5.jpg": property5,
        "property6.jpg": property6,
        "property7.jpg": property7,
        "property8.jpg": property8,
        "property9.jpg": property9,
        "property10.jpg": property10,
        "property11.jpg": property11,
        "property12.jpg": property12,
        "property13.jpg": property13,
        "property14.jpg": property14,
        "property15.jpg": property15,
        "property16.jpg": property16,
        "property17.jpg": property17,
        "property18.jpg": property18,
        "property19.jpg": property19,
        "property20.jpg": property20,
    };

    return (
        <section className="w-full max-w-[78rem] mx-auto px-4">
            <div className="flex flex-col justify-center lg:p-0">
                {/* Heading Section */}
                <HeadingSection
                    categories={categories}
                    inputData={testOverview}
                    selectedCategoryIndex={selectedCategoryIndex}
                    setSelectedCategoryIndex={setSelectedCategoryIndex}
                    setFilteredData={setFilteredData}
                    headingText={sectionName}
                    paragraphText={description}
                    viewMoreLink={viewMoreLink}
                    showFilterBar={showFilter}
                />
                <div className="pagination-bar hidden">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-auto-fit place-items-center box-border gap-8">
                {itemsToShow.map((item, index) => {
                    // Find the category of the current item
                    const category =
                        categories.find(category => testOverview[category].includes(item)) ||
                        'Uncategorized';
                    return (
                        <BlogCard
                            key={index}
                            category={category}
                            imageURL={imageMapping[item.imageURL.split('/').pop()]}
                            name={item.name}
                            descriptions={item.descriptions}
                            author={item.authorName}
                            publishDate={item.publishDate}
                            testURL={item.articleURL}
                            buttonText="Read Article"
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default ArticleSection;
