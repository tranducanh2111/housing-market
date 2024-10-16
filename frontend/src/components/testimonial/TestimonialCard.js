import React from 'react';

// Single Testimonial Card
const TestimonialCard = ({ name, title, description, image }) => {
    return (
        <div className="flex py-2 flex-col items-start gap-1">
            <div className="w-[16.75rem] self-stretch justify-start items-center gap-3 inline-flex">
                <img
                    className="w-[2.875rem] h-[2.875rem] bg-[#DEDEDE] bg-cover bg-center bg-no-repeat rounded-full"
                    src={image}
                    alt={name}
                />
                <div className="flex-col justify-center items-start inline-flex">
                    <div className="text-[#000000D9] text-body-sm sm:text-body font-bold font-Roboto leading-6">
                        {name}
                    </div>
                    <div className="text-[#000000D9] text-footnote-sm sm:text-footnote font-normal font-Roboto leading-5">
                        {title}
                    </div>
                </div>
            </div>
            <div className="text-[#000000D9] text-button-sm font-[400] font-Roboto leading-5">
                "{description}"
            </div>
        </div>
    );
};

export default TestimonialCard;
