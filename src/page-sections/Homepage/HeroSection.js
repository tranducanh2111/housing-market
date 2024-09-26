// src/pages-section/HomePage.js
import React from 'react';
import HeroDecorImage from '../../assets/images/hero-sub-image.png';
import Button from '../../components/Button';
import ArrowRight from '../../assets/icons/arrow-right-white.svg';
import ArrowUpTilt from '../../assets/icons/arrow-up-tilt.svg';
import Hat from '../../assets/icons/hat.svg'
import Light from '../../assets/icons/light.svg'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

import HeroImage from '../../assets/images/homepage-hero-image.png';
import VenueImage from '../../assets/images/venue-general-1.png';
import VenueImage2 from '../../assets/images/venue-image-1.png';
import VenueImage3 from '../../assets/images/venue-image-2.png';  
import VenueImage4 from '../../assets/images/venue-image-3.png';
import VenueImage5 from '../../assets/images/venue-image-4.png';
import SmallLocationImage from '../../assets/images/small-image.png';

const slidesData = [
    {
        image: VenueImage,
        title: 'Obese',
        rating: '4.5/5',
        authorDate: 'By John Doe - 18/09/2024',
    },
    {
        image: VenueImage2,
        title: 'Obese',
        rating: '4.5/5',
        authorDate: 'By John Doe - 18/09/2024',
    },
    {
        image: VenueImage3,
        title: 'Obese',
        rating: '4.5/5',
        authorDate: 'By John Doe - 18/09/2024',
    },
    {
        image: VenueImage4,
        title: 'Obese',
        rating: '4.5/5',
        authorDate: 'By John Doe - 18/09/2024',
    },
    {
        image: VenueImage5,
        title: 'Obese',
        rating: '4.5/5',
        authorDate: 'By John Doe - 18/09/2024',
    },
];

const HeroSection = () => {
    return (
        <main className='grid grid-cols-1 xl:grid-cols-2 gap-16'>
            {/* Main Content Container */}
            <section className='flex flex-col gap-y-12'>
                {/* Heading */}
                <section className='w-full'>
                    <div className='flex flex-row items-center mb-6'>
                        <h1 className='text-h1-sm sm:text-h1'>Your Health, Our Priority</h1>
                        <figure className='hidden xl:flex h-full items-center justify-center aspect-[97/120]'>
                            <img src={HeroDecorImage} alt='Housing Market Analysis' className='w-full h-full aspect-[97/120]'/>
                        </figure>
                    </div>
                    <div className='grid grid-cols-[auto_1fr] gap-x-10 xl:gap-x-16 items-end'>
                        <h3 className='text-h3-sm sm:text-h3 font-bold'>Your journey to better health starts here.</h3>
                        <div className='hidden xs:block'>
                            <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>
                </section>
                {/* CTA */}
                <section className='w-full grid sm:grid-cols-[1fr_auto] gap-x-10 gap-y-2 items-center'>
                    <p className='text-body-sm sm:text-body'>We specialize in empowering you with personalized insights and tools to manage diabetes and enhance your well-being.</p>
                    <Button
                        title='What&apos;s going on?'
                        icon={ArrowRight}
                        className='bg-primary w-fit'
                        textColor='text-white'
                    />
                </section>
                {/* Statistic */}
                <section className='w-full h-fit flex flex-col xs:flex-row justify-between items-center space-y-6 xs:space-y-0'>
                    <div className='text-center xs:text-left h-fit'>
                        <h2 className='text-h2-sm sm:text-h2 mb-2'>115k+</h2>
                        <p className='text-body-sm sm:text-body font-bold'>Capital Raise</p>
                    </div>
                    {/* Vertical Line */}
                    <div className='hidden xs:block'>
                        <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    {/* Horizontal Line */}
                    <div className='w-[60%] flex xs:hidden justify-center'>
                        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className='text-center xs:text-left h-fit'>
                        <h2 className='text-h2-sm sm:text-h2 mb-2'>24k+</h2>
                        <p className='text-body-sm sm:text-body font-bold'>Health Articles</p>
                    </div>
                    {/* Vertical Line */}
                    <div className='hidden xs:block'>
                        <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    {/* Horizontal Line */}
                    <div className='w-[60%] flex xs:hidden justify-center'>
                        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className='text-center xs:text-left h-fit'>
                        <h2 className='text-h2-sm sm:text-h2 mb-2'>47k+</h2>
                        <p className='text-body-sm sm:text-body font-bold'>Property Sold</p>
                    </div>
                </section>
                {/* Slider for the cards */}
                <section className='w-full h-fit'>
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        initialSlide={2}
                        modules={[EffectCards, Autoplay]}
                        speed={300}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        className="mySwiper max-w-[450px]"
                    >
                        {slidesData.map((slide, index) => (
                                <SwiperSlide key={index} className='aspect-video rounded-2xl'>
                                    <figure className='w-full h-full rounded-2xl'>
                                        <img src={slide.image} alt='Housing Market Analysis' className='w-full h-full object-cover rounded-2xl' />
                                    </figure>
                                    {/* Article Title */}
                                    <div className='absolute top-3 left-3 px-2 py-1 mix-blend-luminosity bg-opacity-20 bg-black backdrop-blur-md rounded-lg border-2 border-white z-10'>
                                        <h4 id="swiper-title" className='text-white text-h4-sm sm:text-h4 font-semibold line-clamp-1'>{slide.title}</h4>
                                    </div>
                                    <div className='absolute bottom-3 left-3 z-10'>
                                        <div className='w-fit mb-2 px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg'>
                                            <p id="swiper-rating" className='text-white text-footnote-sm sm:text-footnote line-clamp-1'>Rating: {slide.rating}</p>
                                        </div>
                                        <div className='w-fit px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg'>
                                            <p id="swiper-author-date" className='text-white text-footnote-sm sm:text-footnote line-clamp-1'>{slide.authorDate}</p>
                                        </div>
                                    </div>
                                    <Button
                                        title='More Details'
                                        icon={ArrowRight}
                                        className='absolute bottom-3 right-3 z-10 mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md rounded-lg'
                                        textColor='text-white'
                                        style={{
                                            padding: '2px 8px',
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </section>
            </section>
            {/* Main Image Container */}
            <section
                className="relative w-full bg-cover h-[32rem] xl:h-full bg-center rounded-2xl flex flex-col"
                style={{
                    background: `linear-gradient(180deg, rgba(0, 1, 0, 0.1) 44.65%, #000000 100%), url(${HeroImage})`,
                }}
            >
                <article className="absolute top-3 left-3 p-2 bg-white rounded-lg aspect-[268/98] max-w-[19.75rem] max-h-[6.5rem] sm:max-h-[7rem] flex">
                    <div className="grow">
                    <h4 className="text-h4-sm sm:text-h4 font-semibold line-clamp-2 mb-3">
                        Melbourne, VIC, Australia
                    </h4>
                    <Button
                        icon={ArrowUpTilt}
                        className="bg-primary w-fit h-[2.5rem] aspect-square"
                        textColor="text-white"
                        style={{
                        padding: "4px",
                        borderRadius: "50%",
                        }}
                        classNameIcon={"h-6 w-6"}
                    />
                    </div>
                    <figure className="h-full aspect-[110/80] rounded-lg">
                    <img
                        src={SmallLocationImage}
                        alt="Housing Market Analysis"
                        className="h-full w-full object-cover rounded-sm"
                        width={24}
                        height={24}
                    />
                    </figure>
                </article>

                {/* Add mt-auto to push this article to the bottom */}
                <article className="p-3 mt-auto">
                    <div className="pl-2 border-l border-white border-opacity-70 mb-">
                        <p className="text-body text-white">
                            Gain control of your diabetes with insights that fit your unique health profile. Stay on top of your goals, diet, and lifestyle choices with ease.
                        </p>
                    </div>
                    <div className="flex justify-between flex-wrap mt-4 gap-2">
                        <Button
                            title="Personalized Insight"
                            icon={Light}
                            className="flex-1 min-w-fit mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md border border-white rounded-md text-white"
                            textColor="text-white"
                        />
                        <Button
                            title="Join our Survey"
                            icon={Hat}
                            className="flex-1 min-w-fit bg-primary rounded-md text-white"
                            textColor="text-white"
                        />
                    </div>
                </article>
            </section>
        </main>
    );
};

export default HeroSection;