import React, { forwardRef } from 'react';

// Button component definition using forwardRef for passing refs to the button element
const Button = forwardRef(
    (
        { 
            title,                 // The text to display on the button
            onClick,              // Function to handle button click events
            icon,                 // Icon to display in the button
            className,            // Additional CSS classes for the button
            classNameIcon,        // Additional CSS classes for the icon
            style,                // Inline styles for the button
            textColor,            // Text color class for the button text
            disabled = false       // Boolean to indicate if the button is disabled (default is false)
        },
        ref, // The ref forwarded to the button element
    ) => {
        // Manually concatenate class strings for the button's CSS classes
        const buttonClasses = `flex items-center justify-center text-body px-[9px] sm:px-[15px] py-[8px] h-[36px] rounded-md transition duration-300 ease-in-out ${
            className || '' // Append additional classes if provided
        } ${textColor}`; // Append text color class

        return (
            <button
                className={buttonClasses} // Apply calculated class names
                onClick={onClick}         // Attach click event handler
                disabled={disabled}       // Disable the button if specified
                aria-label={title}        // Accessibility label for the button
                style={style}             // Apply inline styles if provided
                ref={ref}                 // Attach the forwarded ref
            >
                {/* Render the button content based on the presence of icon and title */}
                {icon && !title ? ( // If there's an icon but no title
                    <span className="flex items-center justify-center">
                        <img
                            src={icon}     // Use the icon as the image source
                            alt="Logo"     // Alternative text for the icon
                            width={14}     // Set width of the icon
                            height={14}    // Set height of the icon
                            className={classNameIcon} // Apply additional icon classes
                        />
                    </span>
                ) : icon && title ? ( // If both icon and title are present
                    <span className="flex items-center justify-center gap-x-[0.5rem]">
                        <img
                            src={icon}     // Use the icon as the image source
                            alt="Logo"     // Alternative text for the icon
                            width={14}     // Set width of the icon
                            height={14}    // Set height of the icon
                            className={classNameIcon} // Apply additional icon classes
                        />
                        <span className={`max-w-content text-body ${textColor}`}>{title}</span> {/* Render the title with styling */}
                    </span>
                ) : (
                    title // If only the title is present, render it
                )}
            </button>
        );
    },
);

// Set the display name for the component for debugging purposes
Button.displayName = 'Button';

export default Button;
