// src/pages-section/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAddressData } from 'api/propertyService';
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

import HeroDecorImage from 'assets/images/hero-sub-image.png';
import HeroImage from 'assets/images/sub-hero-section.jpg';
import VenueImage1 from 'assets/images/homepage-property1.jpg';
import VenueImage2 from 'assets/images/homepage-property2.jpg';
import VenueImage3 from 'assets/images/homepage-property3.jpg';
import VenueImage4 from 'assets/images/homepage-property4.jpg';
import VenueImage5 from 'assets/images/homepage-property5.jpg';
import VenueImage6 from 'assets/images/homepage-property6.jpg';
import VenueImage7 from 'assets/images/homepage-property7.jpg';
import VenueImage8 from 'assets/images/homepage-property8.jpg';
import VenueImage9 from 'assets/images/homepage-property9.jpg';
import VenueImage10 from 'assets/images/homepage-property10.jpg';
import SmallLocationImage from 'assets/images/6618843-150-single-family-home-1.med.jpg';

const slidesData = [
    {
        image: VenueImage1,
        address: '4254 Hayvenhurst Ave',
        city: 'Encino',
        state: 'California',
        bedroom: '8',
        bathroom: '9',
        price: '7,995,000',
        area: 762,
        link: 'https://www.zillow.com/homedetails/4254-Hayvenhurst-Ave-Encino-CA-91436/19994273_zpid/'
    },
    {
        image: VenueImage2,
        address: '4640 Petit Ave',
        city: 'Encino',
        state: 'California',
        bedroom: '6',
        bathroom: '10',
        price: '14,995,000',
        area: 1118,
        link: 'https://www.zillow.com/homedetails/4640-Petit-Ave-Encino-CA-91436/19991694_zpid/'
    },
    {
        image: VenueImage3,
        address: '9880 SW 87th Ave',
        city: 'Miami',
        state: 'Florida',
        bedroom: '5',
        bathroom: '7',
        price: '4,595,000',
        area: 483,
        link: 'https://www.zillow.com/homedetails/9880-SW-87th-Ave-Miami-FL-33176/247679656_zpid/'
    },
    {
        image: VenueImage4,
        address: '6080 SW 104th St',
        city: 'Pinecrest',
        state: 'Florida',
        bedroom: '7',
        bathroom: '9',
        price: '10,499,000',
        area: 794,
        link: 'https://www.zillow.com/homedetails/6080-SW-104th-St-Pinecrest-FL-33156/44024853_zpid/'
    },
    {
        image: VenueImage5,
        address: '808 Lakeside Avenue S',
        city: 'Seattle',
        state: 'Washington',
        bedroom: '3',
        bathroom: '4',
        price: '8,800,000',
        area: 346,
        link: 'https://www.zillow.com/homedetails/808-Lakeside-Ave-S-Seattle-WA-98144/48921603_zpid/'
    },
    {
        image: VenueImage6,
        address: '31 Eagles Landing Ln',
        city: 'Las Vegas',
        state: 'Nevada',
        bedroom: '7',
        bathroom: '11',
        price: '8,250,000',
        area: 1180,
        link: 'https://www.zillow.com/homedetails/31-Eagles-Landing-Ln-Las-Vegas-NV-89141/66826917_zpid/'
    },
    {
        image: VenueImage7,
        address: '1721 S Tioga Way',
        city: 'Las Vegas',
        state: 'Nevada',
        bedroom: '7',
        bathroom: '8',
        price: '4,499,500',
        area: 722,
        link: 'https://www.zillow.com/homedetails/1721-S-Tioga-Way-Las-Vegas-NV-89117/141419815_zpid/'
    },
    {
        image: VenueImage8,
        address: '27 Eagles Landing Ln',
        city: 'Las Vegas',
        state: 'Nevada',
        bedroom: '6',
        bathroom: '8',
        price: '13,279,000',
        area: 1252,
        link: 'https://www.zillow.com/homedetails/27-Eagles-Landing-Ln-Las-Vegas-NV-89141/70055445_zpid/'
    },
    {
        image: VenueImage9,
        address: '5 Promontory Pointe Ln',
        city: 'Las Vegas',
        state: 'Nevada',
        bedroom: '5',
        bathroom: '8',
        price: '21,450,000',
        area: 1215,
        link: 'https://www.zillow.com/homedetails/5-Promontory-Pointe-Ln-Las-Vegas-NV-89135/89592384_zpid/'
    },
    {
        image: VenueImage10,
        address: '25 Painted Feather Way',
        city: 'Las Vegas',
        state: 'Nevada',
        bedroom: '5',
        bathroom: '8',
        price: '9,175,000',
        area: 827,
        link: 'https://www.zillow.com/homedetails/25-Painted-Feather-Way-Las-Vegas-NV-89135/70055548_zpid/'
    },
];

const HeroSection = () => {
    const navigate = useNavigate();

    const handlePropertyPrediction = async (propertyData) => {
        try {
            const { address, city, state } = propertyData;
            
            // Format the address by replacing spaces with %20
            const formattedAddress = address.replace(/\s+/g, '%20');
            const formattedCity = city.replace(/\s+/g, '%20');
            
            // Make the API call using the property service
            const response = await submitAddressData({
                address: formattedAddress,
                city: formattedCity,
                state: state
            });

            // Store the prediction result in localStorage
            localStorage.setItem('predictionResult', JSON.stringify(response));
            
            // Navigate to the personalize insight page
            navigate('/personalize-insight');
        } catch (error) {
            console.error('Error predicting property price:', error);
            // You might want to add error handling here, such as showing a toast notification
        }
    };

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
                        className="bg-primary hover:bg-secondary w-fit"
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
                                        {`${slide.address}, ${slide.city}, ${slide.state}`}
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
                                            Living Area: ${slide.area} m<sup>2</sup>
                                        </p>
                                    </div>
                                </div>
                                <a href={slide.link} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        title="More Details"
                                        icon={ArrowRight}
                                        className="absolute bottom-3 right-3 z-10 mix-blend-luminosity bg-black bg-opacity-20 backdrop-blur-md rounded-lg hover:bg-secondary hover:bg-opacity-100 hover:mix-blend-normal transition duration-200"
                                        textColor="text-white"
                                        style={{
                                            padding: '2px 8px',
                                        }}
                                        onClick={() => handlePropertyPrediction(slide)}
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
                            className="bg-primary w-fit h-[2.5rem] aspect-square hover:bg-secondary transition duration-200"
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
                            className="flex-1 min-w-fit bg-black mix-blend-luminosity bg-opacity-20 backdrop-blur-md border border-white rounded-md text-white hover:bg-secondary hover:border-0 hover:bg-opacity-100 hover:mix-blend-normal transition duration-200"
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
