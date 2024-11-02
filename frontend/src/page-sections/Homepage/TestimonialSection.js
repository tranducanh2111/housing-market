import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import TestimonialCard from 'components/testimonial/TestimonialCard';
import { items } from 'components/testimonial/TestimonialItems';

const TestimonialSection = () => {
    return (
        <section className="relative w-screen sm:w-testimonial overflow-hidden h-[23.25rem] sm:h-[26.25rem]">
            <div className="w-full h-[16.5rem] sm:h-[19.5rem] bg-primary absolute " />

            <div className="max-w-[78rem] h-[15.875rem] sm:h-[18.875rem] flex flex-col mx-auto mt-16 mb-10 xl:px-0 px-4">
                <div className="max-w-[78rem] items-center w-full h-[18.875rem] mx-auto flex flex-col inline-flex absolute top-16 xl:px-5">
                    <div className="w-full">
                        <div className="w-full sm:w-96 h-[5.375rem] flex flex-col items-start gap-1 inline-flex">
                            <h2 className="text-white text-h2-sm sm:text-h2">Testimonials</h2>
                            <p className="w-full text-white text-body-sm sm:text-body tracking-[0.02rem]">
                                Discover how our data-driven insights have helped the community
                                makes informed decisions on real estate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Swiper
                className="justify-start items-start gap-6 inline-flex bottom-[11.5rem] h-[12.5rem]"
                spaceBetween={24}
                slidesPerView="auto"
            >
                {items.map((item, index) => (
                    <SwiperSlide
                        className="px-4 py-2 bg-white rounded-xl shadow-lg flex-col justify-start items-start gap-1 inline-flex"
                        key={index}
                        style={{ maxWidth: '18.75rem', width: '100%', height: '11rem' }}
                    >
                        <TestimonialCard {...item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default TestimonialSection;
