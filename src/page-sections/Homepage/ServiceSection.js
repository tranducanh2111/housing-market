// src/pages-section/ServiceSection.js
import React from 'react';

// Images
import HeroImage from 'assets/images/homepage-hero-image.png';
import Button from 'components/ultility/Button';

const ServiceSection = () => {
    return (
        <section className='flex flex-col gap-[3rem]'>
            <div className='block lg:grid lg:grid-cols-3 gap-x-8 md:gap-x-12 px-5 max-h-44'>
                {/* Header Heading */}
                <div className='col-span-1 mb-8 lg:mb-0 flex flex-col justify-center gap-y-2'>
                    <p className='text-primary text-body font-semibold'>With Diabetes Insight</p>
                    <h3 className='text-h3-sm sm:text-h3'>Empowering health, and understanding in diabetes management.</h3>
                </div>
                {/* Main Card */}
                <div className=' col-span-2 md:grid md:grid-cols-[auto_minmax(21rem,60%)] shadow-lg rounded-[12px]'>
                    <figure className='aspect-video md:aspect-auto md:max-h-[10rem] w-full'>
                        <img src={HeroImage} alt={"Group of People"} loading="lazy" className='object-cover w-full h-full rounded-l-[12px] rounded-r-[12px] md:rounded-r-none' />
                    </figure>
                    <article className='flex flex-wrap flex-col items-center my-auto gap-y-4 p-3'>
                        <div className='flex flex-col gap-y-2'>
                            <h4 className='text-h4 text-center'>Let&apos;s explore your health!</h4>
                            <p className='text-body text-center'>Take the first step towards managing diabetes effectively.</p>
                        </div>
                        <div className='flex flex-wrap gap-x-[1rem]'>
                            <Button title='Track Glucose' className='bg-secondary text-white border border-solid border-primary'/>
                            <Button title='Analyze Reports' className='border-primary border border-solid text-primary' />
                        </div>
                    </article>
                </div>
            </div>
            <div className="h-[410px] md:h-[420px] overflow-x-auto hide-scrollbar sm:px-5">

            </div>
        </section>
    );
};

export default ServiceSection;