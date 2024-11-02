import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use react-router for routing
import HomeIcon from 'assets/icons/home-icon.svg';
import DropdownIcon from 'assets/icons/dropdown.svg';
import ResourceIcon from 'assets/icons/resource.svg';
import ArrowHover from 'assets/icons/arrowhover.svg';
import Arrow from 'assets/icons/arrow.svg';

/**
 * Menu Component
 * Renders a navigation menu with expandable sections and hover effects
 * Features a homepage link and an education center dropdown with sub-items
 */
const Menu = () => {
    // State for controlling the education center submenu expansion
    const [educationCenterSubMenuOpen, setEducationCenterSubMenuOpen] = useState(false);
    // State for tracking which education center item is being hovered
    const [educationCenterHoveredIndex, setEducationCenterHoveredIndex] = useState(-1);

    /**
     * Toggles the education center submenu open/closed state
     */
    const toggleContestSubMenu = () => {
        setEducationCenterSubMenuOpen(!educationCenterSubMenuOpen);
    };

    /**
     * Configuration for education center submenu items
     * Each item has a name, hover state, and target page
     */
    const educationCenterMenu = [
        { name: 'Latest Research', isHovered: false, page: 'latest-research' },
        { name: 'Personal Insight', isHovered: false, page: 'result-dashboard' },
    ];

    /**
     * Handlers for hover states on education center menu items
     */
    const handleContestHoverOn = index => {
        setEducationCenterHoveredIndex(index);
    };

    const handleContestHoverOff = () => {
        setEducationCenterHoveredIndex(-1);
    };

    return (
        <div className="w-[14.5rem] mt-2">
            {/* Homepage navigation button */}
            <button className="mb-4 hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between">
                <Link to="/">
                    <div className="flex">
                        <img src={HomeIcon} alt="Home" width={20} height={20} />
                        <p className="ml-2 tracking-wide text-body-sm sm:text-body">Homepage</p>
                    </div>
                </Link>
            </button>

            {/* Education Center dropdown trigger button */}
            <button
                className={`text-${educationCenterSubMenuOpen ? 'primary' : 'black mb-4'} hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between`}
                onClick={toggleContestSubMenu}
            >
                <div className="flex">
                    <img src={ResourceIcon} alt="Logo" width={20} height={20} />
                    <p className="ml-2 tracking-wide text-body-sm sm:text-body">Education Center</p>
                </div>
                <img src={DropdownIcon} alt="Logo" width={20} height={20} className="" />
            </button>

            {/* Education Center expandable submenu */}
            <div
                className={`overflow-hidden w-full transition-all duration-300 ${
                    educationCenterSubMenuOpen ? 'h-auto' : 'h-0'
                }`}
            >
                <ul className="bg-white shadow-lg rounded">
                    {/* Map through submenu items */}
                    {educationCenterMenu.map((item, index) => (
                        <li key={index}>
                            <a
                                className={`flex px-4 pl-8 py-2 text-body-sm sm:text-body ${
                                    item.isHovered
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-primary hover:text-white'
                                }`}
                                href={item.page}
                                onMouseEnter={() => handleContestHoverOn(index)}
                                onMouseLeave={handleContestHoverOff}
                            >
                                {/* Dynamic arrow icon based on hover state */}
                                <img
                                    src={index === educationCenterHoveredIndex ? ArrowHover : Arrow}
                                    alt="Logo"
                                    width={14}
                                    height={14}
                                    className="mr-2"
                                />
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Menu;