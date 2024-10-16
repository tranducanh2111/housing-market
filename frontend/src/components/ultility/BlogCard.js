// src/ultility/BlogCard.js
import React from 'react';
import ThinArrow from 'assets/icons/thin-arrow.svg';
import Button from 'components/ultility/Button';

// Define the prop types for the Card component
const getFirstWord = str => {
    if (!str) return '';
    return str.split(' ')[0];
};

const BlogCard = ({
    imageURL,
    category,
    name,
    descriptions,
    author,
    publishDate,
    testURL,
    buttonText,
}) => {
    return (
        <section className="w-full aspect-[341/381] rounded-xl bg-[#FBFDFF] shadow-lg pb-2">
            <figure className="relative w-full h-[65%] mb-3 object-cover rounded-t-xl">
                <img
                    src={imageURL}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-t-xl"
                />
            </figure>
            <article className="px-4">
                <h4 className="overflow-y-hidden text-footnote-sm sm:text-footnote text-secondary font-semibold line-clamp-1 mb-1">
                    {category}
                </h4>
                <h3 className="text-h3-sm sm:text-h3 text-primary font-semibold line-clamp-1 mb-3">
                    {name}
                </h3>
                <p className="max-h-[11rem] overflow-y-hidden md:h-[2.75rem] w-auto leading-[1.375rem] text-body-sm sm:text-body md:line-clamp-2 mb-5">
                    {descriptions}
                </p>
                <div className="flex items-center justify-between gap-6">
                    <a href={testURL}>
                        <Button
                            className="font-medium text-primary"
                            icon={ThinArrow}
                            title={buttonText}
                            style={{ padding: 0, margin: 0 }}
                        />
                    </a>
                    <span className="text-footnote-sm sm:text-footnote text-grey">
                        By {getFirstWord(author)} | {publishDate}
                    </span>
                </div>
            </article>
        </section>
    );
};

export default BlogCard;
