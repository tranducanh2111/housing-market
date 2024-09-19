// src/pages-section/HomePage.js
import React from 'react';
import HeroDecorImage from '../../assets/images/hero-sub-image.png';
import Button from '../../components/Button';
import ArrowRight from '../../assets/icons/arrow-right-white.svg';
import ArrowUpTilt from '../../assets/icons/arrow-up-tilt.svg';

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
        <main className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            {/* Main Content Container */}
            <section className='flex flex-col gap-y-12'>
                {/* Heading */}
                <section className='w-full'>
                    <div className='flex flex-row items-center mb-6'>
                        <h1 className='text-h1-sm sm:text-h1'>Reserve your Ideal Home</h1>
                        <figure className='hidden lg:flex h-full items-center justify-center aspect-[97/120]'>
                            <img src={HeroDecorImage} alt='Housing Market Analysis' className='w-full h-full aspect-[97/120]'/>
                        </figure>
                    </div>
                    <div className='grid grid-cols-[auto_1fr] gap-x-10 xl:gap-x-16 items-end'>
                        <h3 className='text-h3-sm sm:text-h3 font-bold'>Let&apos;s get acquainted!</h3>
                        <div className='hidden xs:block'>
                            <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>
                </section>
                {/* CTA */}
                <section className='w-full grid sm:grid-cols-[1fr_auto] gap-x-10 gap-y-2 items-center'>
                    <p className='text-body-sm sm:text-body'>We specialized in curating exceptional villa, mansion, provideing an unparalleled level of comfort, privacy, and convinience for your dream house.</p>
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
                    <div className='hidden xs:block'>
                        <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className='text-center xs:text-left h-fit'>
                        <h2 className='text-h2-sm sm:text-h2 mb-2'>70k+</h2>
                        <p className='text-body-sm sm:text-body font-bold'>Happy Clients</p>
                    </div>
                    <div className='hidden xs:block'>
                        <svg width="2" height="60" xmlns="http://www.w3.org/2000/svg" className='mx-2'>
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
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
                                <SwiperSlide key={index} className='aspect-[367/275] rounded-2xl'>
                                    <figure className='w-full h-full rounded-2xl'>
                                        <img src={slide.image} alt='Housing Market Analysis' className='w-full h-full aspect-[367/275] rounded-2xl' />
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
                className='relative w-full bg-cover h-[32rem] lg:h-full bg-center rounded-2xl'
                style={{ background: `linear-gradient(180deg, rgba(0, 1, 0, 0.1) 44.65%, #000000 100%), url(${HeroImage})` }}
            >
                <article className='absolute top-3 left-3 p-2 bg-white rounded-lg aspect-[268/98] max-w-[19.75rem] flex'>
                    <div className='grow'>
                        <h4 className='text-h4-sm sm:text-h4 font-semibold line-clamp-2 mb-3'>Melbourne, VIC, Australia</h4>
                        <Button
                            icon={ArrowUpTilt}
                            className='bg-primary w-fit h-[2.5rem] aspect-square'
                            textColor='text-white'
                            style={{
                                padding: '4px',
                                borderRadius: '50%',
                            }}
                            classNameIcon={'h-6 w-6'}
                        />
                    </div>
                    <figure className='h-full aspect-[110/80] rounded-lg'>
                        <img src={SmallLocationImage} alt='Housing Market Analysis' className='h-full w-full object-cover rounded-sm' width={24} height={24}/>
                    </figure>
                </article>
            </section>
        </main>
    );
};

export default HeroSection;