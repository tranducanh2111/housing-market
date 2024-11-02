// src/utility/BlogCard.js
import React from 'react'; // Import React library
import ThinArrow from 'assets/icons/thin-arrow.svg'; // Import icon for the button
import Button from 'components/ultility/Button'; // Import custom Button component

// Function to extract the first word from a given string
const getFirstWord = str => {
    if (!str) return ''; // Return an empty string if the input is falsy
    return str.split(' ')[0]; // Split the string by spaces and return the first word
};

// BlogCard component definition
const BlogCard = ({
    imageURL,        // URL of the image to display in the card
    category,        // Category of the blog post
    name,            // Title or name of the blog post
    descriptions,    // Description or excerpt of the blog post
    author,          // Author of the blog post
    publishDate,     // Date the blog post was published
    testURL,        // URL for the button link
    buttonText,      // Text to display on the button
}) => {
    return (
        <section className="w-full aspect-[341/381] rounded-xl bg-[#FBFDFF] shadow-lg pb-2">
            {/* Container for the blog card */}
            <figure className="relative w-full h-[65%] mb-3 object-cover rounded-t-xl">
                {/* Figure element for the blog post image */}
                <img
                    src={imageURL} // Image source
                    alt={name} // Alternative text for the image
                    loading="lazy" // Enable lazy loading for better performance
                    className="w-full h-full object-cover rounded-t-xl" // Style for the image
                />
            </figure>
            <article className="px-4">
                {/* Article container for text content */}
                <h4 className="overflow-y-hidden text-footnote-sm sm:text-footnote text-secondary font-semibold line-clamp-1 mb-1">
                    {category} {/* Display the blog category */}
                </h4>
                <h3 className="text-h3-sm sm:text-h3 text-primary font-semibold line-clamp-1 mb-3">
                    {name} {/* Display the blog title */}
                </h3>
                <p className="max-h-[11rem] overflow-y-hidden md:h-[2.75rem] w-auto leading-[1.375rem] text-body-sm sm:text-body md:line-clamp-2 mb-5">
                    {descriptions} {/* Display the blog description */}
                </p>
                <div className="flex items-center justify-between gap-6">
                    {/* Flex container for the button and author info */}
                    <a href={testURL}>
                        <Button
                            className="font-medium text-primary" // Button styling
                            icon={ThinArrow} // Icon to display on the button
                            title={buttonText} // Text displayed on the button
                            style={{ padding: 0, margin: 0 }} // Inline styles to reset padding and margin
                        />
                    </a>
                    <span className="text-footnote-sm sm:text-footnote text-grey">
                        By {getFirstWord(author)} | {publishDate} {/* Author info and publish date */}
                    </span>
                </div>
            </article>
        </section>
    );
};

export default BlogCard;