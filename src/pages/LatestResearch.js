// src/pages/LatestResearch.js
import React from 'react';
import BannerSection from 'page-sections/Analysis/BannerSection';
import Banner1 from 'assets/images/banner-1.jpg'
import Banner2 from 'assets/images/banner-2.jpg'
import Banner3 from 'assets/images/banner-3.jpg'
import Banner4 from 'assets/images/banner-4.jpg'
import Banner5 from 'assets/images/banner-5.jpg'
import Banner6 from 'assets/images/banner-6.jpg'

// Image List
const imageList = [Banner1, Banner2, Banner3, Banner4, Banner5, Banner6]

const LatestResearch = () => {
    return (
        <section className="mx-auto flex flex-col items-center min-h-screen bg-white gap-y-24">
            <BannerSection imageList={imageList} />
        </section>
    );
};

export default LatestResearch;
