import React from 'react';
import { Link } from 'react-router-dom'; // Use react-router for routing
import Logo from 'assets/icons/Logo.svg';
import Search from './Search';
import Button from '../ultility/Button';
import SideLogo from 'assets/icons/Sidebar.svg';

const Navbar = ({ openSidebar, toggleProfile }) => {
    const handleLogin = () => {
        // Placeholder for login functionality
        console.log('Login clicked');
    };

    return (
        <nav className="bg-white-800 pt-[16px] sm:h-[86px] h-fit">
            <div className="w-[90%] mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/">
                            <div className="flex-shrink-0">
                                <img src={Logo} alt="Logo" className="w-20 sm:w-32" />
                            </div>
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 max-w-[600px] px-[30px]">
                        <Search />
                    </div>
                    <div className="flex justify-center items-center">
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
                        </div>
                        <button
                            className="ml-[25px] text-gray-600 hover:text-gray-900 block sm:hidden"
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
