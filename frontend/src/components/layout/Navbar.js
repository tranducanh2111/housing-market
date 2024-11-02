import React from 'react';
import { Link } from 'react-router-dom'; // Use react-router for routing
import Logo from 'assets/icons/Logo.svg';
import Search from './Search';
import SideLogo from 'assets/icons/Sidebar.svg';

/**
 * Navbar Component
 * Responsive navigation bar that includes logo, search functionality, and mobile sidebar toggle
 * 
 * @param {Object} props
 * @param {Function} props.openSidebar - Function to handle opening the sidebar on mobile
 * @returns {JSX.Element} Navbar component
 */
const Navbar = ({ openSidebar }) => {
    return (
        // Main navigation container with responsive height
        <nav className="bg-white-800 py-3 h-[3.75rem] sm:h-[5.375rem] h-fit">
            {/* Content wrapper with width constraint */}
            <div className="w-[90%] mx-auto">
                {/* Flex container for navbar items */}
                <div className="flex items-center justify-between">
                    {/* Logo section */}
                    <div className="flex items-center">
                        <Link to="/">
                            <div className="flex-shrink-0">
                                {/* Responsive logo size */}
                                <img src={Logo} alt="Logo" className="w-20 sm:w-32" />
                            </div>
                        </Link>
                    </div>

                    {/* Search section - hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-[27.5rem] px-[1.875rem] md:px-0">
                        <Search />
                    </div>

                    {/* Mobile menu section */}
                    <div className="flex md:hidden justify-center items-center">
                        {/* Commented out login/signup buttons
                        <div className="flex items-center">
                            <Button
                                title="Log In"
                                onClick={handleLogin}
                                className="text-black text-body-sm sm:text-body"
                            />
                            <Button
                                title="Sign Up"
                                onClick={handleLogin}
                                className="bg-primary text-body-sm sm:text-body"
                                textColor="text-white"
                            />
                        </div> */}

                        {/* Mobile sidebar toggle button */}
                        <button
                            className="ml-6 text-gray-600 hover:text-gray-900 block sm:hidden"
                            onClick={openSidebar}
                        >
                            <img src={SideLogo} alt="Sidebar Logo" width={30} height={30} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;