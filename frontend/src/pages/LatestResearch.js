// src/pages/LatestResearch.js
/* eslint-disable */
import React from 'react';

import BannerSection from 'page-sections/Analysis/BannerSection';
import GallerySection from 'page-sections/Analysis/GallerySection';
import ArticleSection from 'page-sections/Analysis/ArticleSection';
import ErrorBoundary from 'components/ultility/ErrorBoundary';
import withErrorBoundary from 'hoc/withErrorBoundary';

import Banner1 from 'assets/images/banner-1.jpg';
import Banner2 from 'assets/images/banner-2.jpg';
import Banner3 from 'assets/images/banner-3.jpg';
import Banner4 from 'assets/images/banner-4.jpg';
import Banner5 from 'assets/images/banner-5.jpg';
import Banner6 from 'assets/images/banner-6.jpg';

// Image List
const imageList = [Banner1, Banner2, Banner3, Banner4, Banner5, Banner6];

const LatestResearchContent = () => {
    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24 pb-4">
            <BannerSection imageList={imageList} />
            <GallerySection />
            <ArticleSection
                sectionName={'Resources'}
                viewMoreLink={'#'}
                description={
                    "Discover the Latest Insights in Housing Prices! Stay ahead of the market with our up-to-date analyses, trends, and must-know factors influencing property values. From innovative pricing models to timeless real estate strategies, explore what's shaping the housing landscape and enhance your investment decisions with our latest findings."
                }
                showFilter={true}
            />
        </section>
    );
};

const LatestResearch = () => {
    return (
        <ErrorBoundary>
            <LatestResearchContent />
        </ErrorBoundary>
    );
};

export default withErrorBoundary(LatestResearch);
