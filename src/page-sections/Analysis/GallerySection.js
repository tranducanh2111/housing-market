import React, { useState, useEffect, useRef } from 'react';

import Banner1 from 'assets/images/banner-1.jpg';
import Banner2 from 'assets/images/banner-2.jpg';
import Banner3 from 'assets/images/banner-3.jpg';
import Banner4 from 'assets/images/banner-4.jpg';
import Banner5 from 'assets/images/banner-5.jpg';

const Workshop = () => {
    // Array of image URLs
    const imageURLs = [
        Banner1,
        Banner2,
        Banner3,
        Banner4,
        Banner5,
        Banner1,
        Banner2,
        Banner3,
        Banner4,
        Banner5,
    ];

    // State to store the selected image index
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // State to store whether the main image should transition
    const [shouldTransition, setShouldTransition] = useState(false);

    // Create a ref for the selected photo's DOM element
    const selectedPhotoRef = useRef(null);

    // Function to handle image change
    const changeImage = () => {
        // Trigger transition
        setShouldTransition(true);

        // After a brief delay, change the image and reset transition
        setTimeout(() => {
            setShouldTransition(false);
            setSelectedImageIndex(prevIndex => (prevIndex + 1) % imageURLs.length);
        }, 1000);
    };

    // Scroll to the selected photo when it changes
    useEffect(() => {
        if (selectedPhotoRef.current) {
            selectedPhotoRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [selectedImageIndex]);

    useEffect(() => {
        // Set up an interval to change the image every 6 seconds
        const intervalId = setInterval(changeImage, 6000);
        return () => {
            clearInterval(intervalId); // Clear the interval when the component unmounts
        };
    }, []);

    return (
        <main className="h-24.5 md:h-37 max-w-[78rem] w-full flex flex-col items-center justify-center mx-auto md:py-8 space-y-5 px-4">
            {/* Heading */}
            <section className="space-y-1 w-full max-w-[34rem]">
                <h2 className="text-h2-sm md:text-h2 text-center">Our Latest Research</h2>
                <p className="text-grey text-center text-body-sm sm:text-body">
                    Discover groundbreaking studies and insights into diabetes management,
                    prevention, and treatment.
                </p>
            </section>

            {/* Gallery Banner */}
            <section className="h-[17.75rem] md:h-[26.75rem] w-full md:grid md:grid-cols-7 md:gap-3 space-y-3 md:space-y-0">
                {/* Main Image Container */}
                <div
                    className="h-52 md:h-[26.75rem] relative md:col-span-5"
                    id="main-photo-container"
                    style={{
                        opacity: shouldTransition ? 0 : 1,
                        transition: 'opacity 1s ease-in-out',
                    }}
                >
                    <img
                        src={imageURLs[selectedImageIndex]}
                        alt=""
                        className="w-full h-full rounded-[1rem] object-cover rounded-lg md:rounded-xl"
                    />
                </div>

                {/* Sub-photo container on the right, on the bottom on the mobile view */}
                <div
                    className={`h-16 md:h-full md:max-h-content flex md:flex-col overflow-x-auto relative rounded-md md:rounded-xl md:col-span-2 hide-scrollbar gap-3`}
                    id="sub-photo-container"
                >
                    {imageURLs.map((imageUrl, index) => (
                        <figure
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-grow-0 flex-shrink-0 md:flex-grow md:flex-shrink rounded-lg md:rounded-xl object-cover ${selectedImageIndex === index ? 'relative border-4 md:border-8 border-primary bg-primary' : ''}`}
                            ref={selectedImageIndex === index ? selectedPhotoRef : null}
                        >
                            <div className="flex items-stretch h-full hover:opacity-80 rounded-md">
                                <img
                                    src={imageUrl}
                                    alt=""
                                    className={`h-full w-full object-cover rounded-md`}
                                    style={{
                                        opacity: selectedImageIndex === index ? 1 : 0.8,
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                />
                            </div>
                            {selectedImageIndex === index && (
                                <div className="absolute inset-0 bg-secondary opacity-40 rounded-md"></div>
                            )}
                        </figure>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Workshop;
