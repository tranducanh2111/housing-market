import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import SideLogo from 'assets/icons/Sidebar.svg';
import HomeIcon from 'assets/icons/home-icon.svg';
import ResourceIcon from 'assets/icons/resource.svg';
import Menu from './Menu';

/**
 * Navigation categories configuration
 * Defines the main navigation items with their routes and icons
 */
const categories = [
    { href: '/', src: HomeIcon, alt: 'Home' },
    { href: '/result-dashboard', src: ResourceIcon, alt: 'Education Center' },
];

/**
 * SidebarModal Component
 * A responsive sidebar with two states: extended and collapsed
 * Features a backdrop overlay on mobile and dynamic content visibility
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls sidebar expanded/collapsed state
 * @param {Function} props.closeSidebar - Function to handle closing the sidebar
 * @param {Function} props.openSidebar - Function to handle opening the sidebar
 * @returns {JSX.Element} SidebarModal component
 */
const SidebarModal = ({ isOpen, closeSidebar, openSidebar }) => {
    return (
        <>
            {/* Backdrop overlay - visible only on mobile when sidebar is open */}
            <div
                className={`fixed inset-0 z-[1009] sm:z-0 ${isOpen ? 'block bg-black opacity-50 sm:opacity-0' : 'hidden'}`}
                onClick={closeSidebar}
            ></div>

            {/* Extended sidebar - Full-width sidebar with complete content */}
            <div
                className={`sm:relative fixed inset-y-0 right-0 sm:left-0 top-0 z-[1010] sm:z-0 bg-white mr-0 ${
                    isOpen ? 'w-[16.25rem]' : 'w-[4.375rem] invisible sm:visible duration-0'
                } duration-100`}
            >
                <div className="fixed">
                    {/* Header section with title and close button - visible when expanded */}
                    <div
                        className={`px-4 justify-between flex items-center w-full mb-6 ${!isOpen && 'hidden'}`}
                    >
                        <div className="hidden sm:block">
                            <h2 className="text-xl font-semibold">Dashboard</h2>
                        </div>
                        <button className="pl-28 hidden sm:block" onClick={closeSidebar}>
                            <img src={SideLogo} alt="Logo" width={20} height={20} />
                        </button>
                    </div>

                    {/* Mobile search and menu section - visible when expanded */}
                    <div className={`fixed ${!isOpen && 'hidden'} px-4 pt-2`}>
                        <div className="w-[14.375rem] md:hidden block">
                            <Search />
                        </div>
                        <Menu />
                    </div>
                </div>
            </div>

            {/* Collapsed sidebar - Narrow width with icons only */}
            <div
                className={`bg-[#EEEEEE] hidden sm:block w-[4.375rem] fixed z-50 sm:z-0 top-21 ${
                    isOpen ? 'invisible' : 'visible'
                } duration-50`}
            >
                <div className="p-2 flex flex-col justify-items-stretch justify-start bg-white items-center">
                    {/* Sidebar toggle button */}
                    <div className="menu_bar mb-12 cursor-pointer" onClick={openSidebar}>
                        <img src={SideLogo} alt="Logo" width={20} height={20} />
                    </div>

                    {/* Navigation icons */}
                    {categories.map((category, index) => (
                        <Link key={index} to={category.href}>
                            <div className="menu_bar mb-[36px] cursor-pointer">
                                <img src={category.src} alt={category.alt} width={20} height={20} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SidebarModal;