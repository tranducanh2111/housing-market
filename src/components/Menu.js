import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use react-router for routing
import HomeIcon from '../assets/icons/home-icon.svg';
import DropdownIcon from '../assets/icons/dropdown.svg';
import PeopleIcon from '../assets/icons/people.svg';
import ResourceIcon from '../assets/icons/resource.svg';
import ContactIcon from '../assets/icons/contact.svg';
import BlogIcon from '../assets/icons/blog.svg';
import ArrowHover from '../assets/icons/arrowhover.svg';
import Arrow from '../assets/icons/arrow.svg';

const Menu = () => {
    const [educationCenterSubMenuOpen, setEducationCenterSubMenuOpen] = useState(false);
    const [educationCenterHoveredIndex, setEducationCenterHoveredIndex] = useState(-1);

    const toggleContestSubMenu = () => {
        setEducationCenterSubMenuOpen(!educationCenterSubMenuOpen);
    };

    const educationCenterMenu = [
        { name: 'Latest Research', isHovered: false, page: 'latest-research' },
        { name: 'Nutrition Guidelines', isHovered: false, page: 'nutrition-guidelines' },
        { name: 'Exercise Tips', isHovered: false, page: 'exercise-tips' },
    ];

    const handleContestHoverOn = index => {
        setEducationCenterHoveredIndex(index);
    };

    const handleContestHoverOff = () => {
        setEducationCenterHoveredIndex(-1);
    };

    return (
        <div className="w-[232px] mt-2">
            {/* Homepage */}
            <button className="mb-[16px] hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between">
                <Link to="/">
                    <div className="flex">
                        <img src={HomeIcon} alt="Home" width={20} height={20} />
                        <p className="ml-2 tracking-wide">Homepage</p>
                    </div>
                </Link>
            </button>
            {/* Education Center Group */}
            <button
                className={`text-${educationCenterSubMenuOpen ? 'primary' : 'black mb-[16px]'} hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between`}
                onClick={toggleContestSubMenu}
            >
                <div className="flex">
                    <img src={ResourceIcon} alt="Logo" width={20} height={20} />
                    <p className="ml-2 tracking-wide">Education Center</p>
                </div>
                <img src={DropdownIcon} alt="Logo" width={20} height={20} className="" />
            </button>
            {/* Education Center Categories */}
            <div
                className={`overflow-hidden w-full transition-all duration-300 ${
                    educationCenterSubMenuOpen ? 'h-auto' : 'h-0'
                }`}
            >
                <ul className="bg-white shadow-lg rounded">
                    {educationCenterMenu.map((item, index) => (
                        <li key={index}>
                            <a
                                className={`flex px-4 pl-8 py-2 ${
                                    item.isHovered
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-primary hover:text-white'
                                }`}
                                href={item.page}
                                onMouseEnter={() => handleContestHoverOn(index)}
                                onMouseLeave={handleContestHoverOff}
                            >
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
            {/* About Us */}
            <button className="mb-[16px] hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between">
                <Link to="/about">
                    <div className="flex">
                        <img src={PeopleIcon} alt="About Us" width={20} height={20} />
                        <p className="ml-2 tracking-wide">About Us</p>
                    </div>
                </Link>
            </button>
            {/* Contact Us */}
            <button className="mb-[16px] hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between">
                <Link to="/contact">
                    <div className="flex">
                        <img src={ContactIcon} alt="Sponsors" width={20} height={20} />
                        <p className="ml-2 tracking-wide">Contact Us</p>
                    </div>
                </Link>
            </button>
            {/* Blog */}
            <button className="mb-[16px] hover:text-primary focus:outline-none flex items-center w-full text-left py-2 justify-between">
                <Link to="/blog">
                    <div className="flex">
                        <img src={BlogIcon} alt="Blog" width={20} height={20} />
                        <p className="ml-2 tracking-wide">Blog</p>
                    </div>
                </Link>
            </button>
        </div>
    );
};

export default Menu;
