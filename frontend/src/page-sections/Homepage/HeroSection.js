// src/pages-section/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroDecorImage from 'assets/images/hero-sub-image.png';
import Button from 'components/ultility/Button';
import ArrowRight from 'assets/icons/arrow-right-white.svg';
import ArrowUpTilt from 'assets/icons/arrow-up-tilt.svg';
// import Hat from 'assets/icons/hat.svg';
import Light from 'assets/icons/light.svg';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

import HeroImage from 'assets/images/sub-hero-section.jpg';
import VenueImage from 'assets/images/7478054_0.jpg';
import VenueImage2 from 'assets/images/4196182_0.jpg';
import VenueImage3 from 'assets/images/streetview.jpg';
import VenueImage4 from 'assets/images/genMid.2510113_0.jpg';
import VenueImage5 from 'assets/images/6618843-150-single-family-home-1.med.jpg';
import SmallLocationImage from 'assets/images/6618843-150-single-family-home-1.med.jpg';

const slidesData = [
    {
        image: VenueImage,
        title: '1237 Citadel Dr NE, Atlanta, GA 30324',
        bedroom: '5',
        bathroom: '5',
        price: '1,950,000',
        link: 'https://www.zillow.com/homedetails/1237-Citadel-Dr-NE-Atlanta-GA-30324/14533056_zpid/'
    },
    {
        image: VenueImage2,
        title: '5348 Rockwood Rd, Charlotte, NC 28216',
        bedroom: '3',
        bathroom: '2',
        price: '374,990',
        link: 'https://www.zillow.com/homedetails/5348-Rockwood-Rd-Charlotte-NC-28216/64999929_zpid/'
    },
    {
        image: VenueImage3,
        title: '201 Sleepy Hollow Dr, Amherst, OH 44001',
        bedroom: '4',
        bathroom: '3',
        price: '385,000',
        link: 'https://www.zillow.com/homedetails/201-Sleepy-Hollow-Dr-Amherst-OH-44001/34571745_zpid/'
    },
    {
        image: VenueImage4,
        title: '759 London Groveport Rd, Lockbourne, OH 43137',
        bedroom: '4',
        bathroom: '3',
        price: '749,900',
        link: 'https://www.zillow.com/homedetails/759-London-Groveport-Rd-Lockbourne-OH-43137/34036365_zpid/'
    },
    {
        image: VenueImage5,
        title: '38655 Branch Ave, North Branch, MN 55056',
        bedroom: '2',
        bathroom: '3',
        price: '155,000',
        link: 'https://www.zillow.com/homedetails/38655-Branch-Ave-North-Branch-MN-55056/53220179_zpid/'
    },
];

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <main className="max-w-[78rem] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-16 px-4">
            {/* Main Content Container */}
            <section className="flex flex-col gap-y-12">
                {/* Heading */}
                <section className="w-full">
                    <div className="flex flex-row items-center mb-6">
                        <h1 className="text-h1-sm sm:text-h1">Together, We Grow</h1>
                        <figure className="hidden xl:flex h-full items-center justify-center aspect-[97/120]">
                            <img
                                src={HeroDecorImage}
                                alt="Housing Market Analysis"
                                className="w-full h-full aspect-[97/120]"
                            />
                        </figure>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-10 xl:gap-x-16 items-end">
                        <h3 className="text-h3-sm sm:text-h3 font-bold">
                            Gain better investments now!
                        </h3>
                        <div className="hidden xs:block">
                            <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                                <line
                                    x1="0"
                                    y1="100%"
                                    x2="100%"
                                    y2="100%"
                                    stroke="black"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>
                    </div>
                </section>
                {/* CTA */}
                <section className="w-full grid sm:grid-cols-[1fr_auto] gap-x-10 gap-y-2 items-center">
                    <p className="text-body-sm sm:text-body">
                        We specialize in empowering you with personalized insights and tools to
                        optimize your price prediction strategies and enhance your investment
                        success.
                    </p>
                    <Button
                        title="What's going on?"
                        icon={ArrowRight}
                        className="bg-primary w-fit"
                        textColor="text-white"
                        onClick={() => navigate('/latest-research')}
                    />
                </section>
                {/* Statistic */}
                <section className="w-full h-fit flex flex-col xs:flex-row justify-between items-center space-y-6 xs:space-y-0">
                    <div className="text-center xs:text-left h-fit">
                        <h2 className="text-h2-sm sm:text-h2 mb-2">115k+</h2>
                        <p className="text-body-sm sm:text-body font-bold">Capital Raise</p>
                    </div>
                    {/* Vertical Line */}
                    <div className="hidden xs:block">
                        <svg
                            width="2"
                            height="60"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-2"
                        >
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    {/* Horizontal Line */}
                    <div className="w-[60%] flex xs:hidden justify-center">
                        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className="text-center xs:text-left h-fit">
                        <h2 className="text-h2-sm sm:text-h2 mb-2">24k+</h2>
                        <p className="text-body-sm sm:text-body font-bold">Properties</p>
                    </div>
                    {/* Vertical Line */}
                    <div className="hidden xs:block">
                        <svg
                            width="2"
                            height="60"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-2"
                        >
                            <line x1="0" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    {/* Horizontal Line */}
                    <div className="w-[60%] flex xs:hidden justify-center">
                        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className="text-center xs:text-left h-fit">
                        <h2 className="text-h2-sm sm:text-h2 mb-2">47k+</h2>
                        <p className="text-body-sm sm:text-body font-bold">Trusted Clients</p>
                    </div>
                </section>
                {/* Slider for the cards */}
                <section className="w-full h-fit">
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
                            <SwiperSlide key={index} className="aspect-video rounded-2xl">
                                <figure className="w-full h-full rounded-2xl">
                                    <img
                                        src={slide.image}
                                        alt="Housing Market Analysis"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </figure>
                                {/* Article Title */}
                                <div className="absolute top-3 left-3 px-2 py-1 mix-blend-luminosity bg-opacity-20 bg-black backdrop-blur-md rounded-lg border-2 border-white z-10">
                                    <h4
                                        id="swiper-title"
                                        className="text-white text-h4-sm sm:text-h4 font-semibold line-clamp-1"
                                    >
                                        {slide.title}
                                    </h4>
                                </div>
                                <div className="absolute bottom-3 left-3 z-10">
                                    <div className="w-fit mb-2 px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg">
                                        <p
                                            id="swiper-bedroom"
                                            className="text-white text-footnote-sm sm:text-footnote line-clamp-1"
                                        >
                                            Bedroom: {slide.bedroom}
                                        </p>
                                    </div>
                                    <div className="w-fit mb-2 px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg">
                                        <p
                                            id="swiper-bedroom"
                                            className="text-white text-footnote-sm sm:text-footnote line-clamp-1"
                                        >
                                            Bathroom: {slide.bathroom}
                                        </p>
                                    </div>
                                    <div className="w-fit px-2 py-1 bg-black bg-opacity-20 mix-blend-luminosity backdrop-blur-md rounded-lg">
                                        <p
                                            id="swiper-author-date"
                                            className="text-white text-footnote-sm sm:text-footnote line-clamp-1"
                                        >
                                            Price: ${slide.price}
                                        </p>
                                    </div>
                                </div>
                                <a href={slide.link} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        title="More Details"
                                        icon={ArrowRight}
                                        className="absolute bottom-3 right-3 z-10 mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md rounded-lg"
                                        textColor="text-white"
                                        style={{
                                            padding: '2px 8px',
                                        }}
                                    />
                                </a>
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
                                padding: '4px',
                                borderRadius: '50%',
                            }}
                            classNameIcon={'h-6 w-6'}
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
                    <div className="pl-2 border-l border-white border-opacity-70">
                        <p className="text-body text-white">
                            Take charge of your price prediction strategy with tailored insights that match your unique market profile. Stay ahead of your forecasting goals, investment strategies, and data-driven decisions with confidence.
                        </p>
                    </div>
                    <div className="flex justify-between flex-wrap mt-4 gap-2">
                        <Button
                            title="Personalized Insight"
                            icon={Light}
                            className="flex-1 min-w-fit mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md border border-white rounded-md text-white"
                            textColor="text-white"
                            onClick={() => navigate('/result-dashboard')}
                        />
                        {/* <Button
                            title="Join our Survey"
                            icon={Hat}
                            className="flex-1 min-w-fit bg-primary rounded-md text-white"
                            textColor="text-white"
                            onClick={() => navigate('/result-dashboard')}
                        /> */}
                    </div>
                </article>
            </section>
        </main>
    );
};

export default HeroSection;
