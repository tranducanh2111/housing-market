// src/pages/LatestResearch.js
import React from 'react';

import BannerSection from 'page-sections/Analysis/BannerSection';
import GallerySection from 'page-sections/Analysis/GallerySection';
import ArticleSection from 'page-sections/Analysis/ArticleSection';

import Banner1 from 'assets/images/banner-1.jpg';
import Banner2 from 'assets/images/banner-2.jpg';
import Banner3 from 'assets/images/banner-3.jpg';
import Banner4 from 'assets/images/banner-4.jpg';
import Banner5 from 'assets/images/banner-5.jpg';
import Banner6 from 'assets/images/banner-6.jpg';

// Image List
const imageList = [Banner1, Banner2, Banner3, Banner4, Banner5, Banner6];

const LatestResearch = () => {
    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24">
            <BannerSection imageList={imageList} />
            <GallerySection />
            <ArticleSection
                sectionName={'Resources'}
                viewMoreLink={'#'}
                description={
                    "Explore the Latest Arrivals! Stay ahead of the curve with our newest products, innovations, and must-haves. From cutting-edge tech to timeless classics, find what's trending and elevate your lifestyle with our latest offerings."
                }
                showFilter={true}
            />
        </section>
    );
};

export default LatestResearch;
