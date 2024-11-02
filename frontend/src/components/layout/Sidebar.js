import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import SideLogo from 'assets/icons/Sidebar.svg';
import HomeIcon from 'assets/icons/home-icon.svg';
import ResourceIcon from 'assets/icons/resource.svg';
import Menu from './Menu';

const categories = [
    { href: '/', src: HomeIcon, alt: 'Home' },
    { href: '/result-dashboard', src: ResourceIcon, alt: 'Education Center' },
];

const SidebarModal = ({ isOpen, closeSidebar, openSidebar }) => {
    return (
        <>
            <div
                className={`fixed inset-0 z-[1009] sm:z-0 ${isOpen ? 'block bg-black opacity-50 sm:opacity-0' : 'hidden'}`}
                onClick={closeSidebar}
            ></div>

            {/* Extended sidebar */}
            <div
                className={`sm:relative fixed inset-y-0 right-0 sm:left-0 top-0 z-[1010] sm:z-0 bg-white mr-0 ${isOpen ? 'w-[16.25rem]' : 'w-[4.375rem] invisible sm:visible duration-0'} duration-100`}
            >
                <div className="fixed">
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
                    <div className={`fixed ${!isOpen && 'hidden'} px-4 pt-2`}>
                        <div className="w-[14.375rem] md:hidden block">
                            <Search />
                        </div>
                        <Menu />
                    </div>
                </div>
            </div>

            {/* Small sidebar */}
            <div
                className={`bg-[#EEEEEE] hidden sm:block w-[4.375rem] fixed z-50 sm:z-0 top-21 ${isOpen ? 'invisible' : 'visible'} duration-50`}
            >
                <div className="p-2 flex flex-col justify-items-stretch justify-start bg-white items-center">
                    <div className="menu_bar mb-12 cursor-pointer" onClick={openSidebar}>
                        <img src={SideLogo} alt="Logo" width={20} height={20} />
                    </div>
                    {/* Render categories dynamically */}
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
