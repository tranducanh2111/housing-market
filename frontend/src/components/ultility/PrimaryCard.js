import React from 'react';

import Button from './Button';

import ArrowSvg from 'assets/icons/arrow-head.svg';

const PrimaryCard = ({ imageURL, name, descriptions, testURL, buttonText }) => {
    return (
        <section className="flex flex-col bg-[#FBFDFF] rounded-2xl shadow-lg overflow-hidden h-full">
            <figure className="w-full h-0 pb-[65%] relative">
                <img
                    src={imageURL}
                    alt={name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </figure>
            <article className="flex flex-col items-center justify-between p-4 flex-grow">
                <div className="text-center mb-4">
                    <h3 className="text-h3-sm md:text-h3 text-primary font-semibold mb-2 line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-grey text-body-sm sm:text-body line-clamp-2">
                        {descriptions}
                    </p>
                </div>
                <a href={testURL} className="mt-auto">
                    <Button
                        title={buttonText}
                        icon={ArrowSvg}
                        className="text-body-sm sm:text-body-sm border border-solid text-[#FFFFFF] bg-secondary border-primary py-[6px] px-[15px] max-w-content"
                    />
                </a>
            </article>
        </section>
    );
};

export default PrimaryCard;
