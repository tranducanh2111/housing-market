// src/pages-section/ServiceSection.js
import React from 'react';

// Images
import HeroImage from 'assets/images/homepage-hero-image.png';
import Button from 'components/ultility/Button';
import PrimaryCard from 'components/ultility/PrimaryCard';

const cardData = [
    {
        name: "Glucose Monitoring",
        descriptions: "Track your daily blood sugar levels and get real-time insights for effective management.",
        testURL: "",
        buttonText: "Let's go",
        imageURL: HeroImage
    },
    {
        name: "Glucose Monitoring",
        descriptions: "Track your daily blood sugar levels and get real-time insights for effective management.",
        testURL: "",
        buttonText: "Let's go",
        imageURL: HeroImage
    },
    {
        name: "Glucose Monitoring",
        descriptions: "Track your daily blood sugar levels and get real-time insights for effective management.",
        testURL: "",
        buttonText: "Let's go",
        imageURL: HeroImage
    }
]

const ServiceSection = () => {
    return (
        <section className='max-w-[78rem] mx-auto flex flex-col gap-[3rem] px-4'>
            <div className='block lg:grid lg:grid-cols-3 gap-x-8 md:gap-x-12'>
                {/* Header Heading */}
                <div className='col-span-1 mb-6 lg:mb-0 flex flex-col justify-center'>
                    <p className='text-primary text-body-sm sm:text-body font-semibold'>With Diabetes Insight</p>
                    <h3 className='text-h3-sm sm:text-h3'>Empowering health, and understanding in diabetes management.</h3>
                </div>
                {/* Main Card */}
                <div className='col-span-2 md:grid md:grid-cols-[auto_minmax(10rem,60%)] shadow-lg rounded-2xl'>
                    <figure className='aspect-video md:aspect-auto xs:max-h-[10rem] w-full'>
                        <img src={HeroImage} alt={"Group of People"} loading="lazy" className='object-cover w-full h-full rounded-l-[12px] rounded-r-[12px] md:rounded-r-none' />
                    </figure>
                    <article className='flex flex-wrap flex-col items-center my-auto gap-y-4 p-3'>
                        <div className='flex flex-col gap-y-2'>
                            <h4 className='text-h4-sm sm:text-h4 text-center'>Let&apos;s explore your health!</h4>
                            <p className='text-body-sm sm:text-body text-center'>Take the first step towards managing diabetes effectively.</p>
                        </div>
                        <div className='flex flex-wrap gap-x-[1rem]'>
                            <Button title='Track Glucose' className='bg-secondary text-white border border-solid border-primary text-body-sm sm:text-body'/>
                            <Button title='Analyze Reports' className='border-primary border border-solid text-primary text-body-sm sm:text-body' />
                        </div>
                    </article>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {cardData.map((card, index) => (
                    <PrimaryCard
                    key={index}
                    name={card.name}
                    descriptions={card.descriptions}
                    testURL={card.testURL}
                    buttonText={card.buttonText}
                    imageURL={card.imageURL}
                    />
                ))}
            </div>
        </section>
    );
};

export default ServiceSection;