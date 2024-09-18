// src/pages-section/HomePage.js
import React from 'react';
import HeroImage from '../../assets/images/hero-sub-image.png';
import Button from '../../components/Button';
import ArrowRight from '../../assets/icons/arrow-right-white.svg';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

import VenueImage from '../../assets/images/venue-general-1.png';
import VenueImage2 from '../../assets/images/venue-image-1.png';
import VenueImage3 from '../../assets/images/venue-image-2.png';  
import VenueImage4 from '../../assets/images/venue-image-3.png';
import VenueImage5 from '../../assets/images/venue-image-4.png';

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
        <main className='grid grid-cols-1 md:grid-cols-2'>
        {/* Main Content Container */}
        <section className='flex flex-col gap-y-12'>
            {/* Heading */}
            <section className='w-full'>
                <div className='flex flex-row items-center mb-6'>
                    <h1 className='text-h1'>Reserve your Ideal Home</h1>
                    <figure className='h-full flex items-center justify-center aspect-[97/120]'>
                        <img src={HeroImage} alt='Housing Market Analysis' className='w-full h-full aspect-[97/120]'/>
                    </figure>
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-x-32 items-end'>
                    <h3 className='text-h3 font-bold'>Let&apos;s get acquainted!</h3>
                    <div className=''>
                        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                </div>
            </section>
            {/* CTA */}
            <section className='w-full grid grid-cols-[1fr_auto] gap-x-10 items-center'>
                <p className='text-body'>We specialized in curating exceptional villa, mansion, provideing an unparalleled level of comfort, privacy, and convinience for your dream house.</p>
                <Button
                    title='What&apos;s going on?'
                    icon={ArrowRight}
                    className='bg-primary'
                    textColor='text-white'
                />
            </section>
            {/* Statistic */}
            <section className='w-full h-fit flex flex-row justify-between items-center'>
                <div className='h-fit'>
                    <h2 className='text-h2 mb-2'>115k+</h2>
                    <p className='text-body font-bold'>Capital Raise</p>
                </div>
                <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                    <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                </svg>
                <div className='h-fit'>
                    <h2 className='text-h2 mb-2'>70k+</h2>
                    <p className='text-body font-bold'>Happy Clients</p>
                </div>
                <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                    <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                </svg>
                <div className='h-fit'>
                    <h2 className='text-h2 mb-2'>47k+</h2>
                    <p className='text-body font-bold'>Property Sold</p>
                </div>
            </section>
            {/* Slider for the cards */}
            <section className='w-full h-fit'>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    initialSlide={2}
                    modules={[EffectCards, Autoplay]}
                    speed={1200}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    className="mySwiper max-w-[450px]"
                >
                    {slidesData.map((slide, index) => (
                            <SwiperSlide key={index} className='aspect-[367/275] rounded-2xl'>
                                <figure className='w-full h-full rounded-2xl'>
                                    <img src={slide.image} alt='Housing Market Analysis' className='w-full h-full aspect-[367/275] rounded-2xl' />
                                </figure>
                                {/* Article Title */}
                                <div className='absolute top-3 left-3 px-2 py-1 mix-blend-luminosity bg-opacity-20 bg-black backdrop-blur-md rounded-lg border-2 border-white z-10'>
                                    <h4 id="swiper-title" className='text-white text-h4 font-semibold line-clamp-1'>{slide.title}</h4>
                                </div>
                                <div className='absolute bottom-3 left-3 z-10'>
                                    <div className='w-fit mb-2 px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg'>
                                        <p id="swiper-rating" className='text-white text-footnote line-clamp-1'>Rating: {slide.rating}</p>
                                    </div>
                                    <div className='w-fit px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg'>
                                        <p id="swiper-author-date" className='text-white text-footnote line-clamp-1'>{slide.authorDate}</p>
                                    </div>
                                </div>
                                <Button
                                    title='More Details'
                                    icon={ArrowRight}
                                    className='absolute bottom-3 right-3 z-10 mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md rounded-lg'
                                    textColor='text-white'
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </section>
        </section>
        </main>
    );
};

export default HeroSection;