import React, { useState } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const NavigateButton = ({ imageList, activeIndex }) => {
    const swiper = useSwiper();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            {imageList.map((_, index) => (
                <div
                    onClick={() => swiper.slideToLoop(index)}
                    key={index}
                    className={`w-7 sm:w-12 h-2 px-2.5 sm:px-6 py-1 ${
                        activeIndex === index ? 'bg-white' : 'bg-grey opacity-50'
                    } rounded-lg inline-block mx-1 cursor-pointer`}
                />
            ))}
        </div>
    );
};

const BannerSection = ({ imageList }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Autoplay]}
                loop={true}
                slidesPerView={1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
                className="mySwiper"
            >
                {imageList.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Banner ${index + 1}`}
                            className="max-h-[30rem] object-cover w-full"
                        />
                    </SwiperSlide>
                ))}
                <NavigateButton imageList={imageList} activeIndex={activeIndex} />
            </Swiper>
        </div>
    );
};

export default BannerSection;
