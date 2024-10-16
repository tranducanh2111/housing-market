import React from 'react';
import SidebarModal from './Sidebar';
import Profile from './Profile';

const Layout = ({ children, isOpen, openSidebar, closeSidebar, isProfileOpen, closeProfile }) => {
    return (
        <>
            <main className="flex justify-start overflow-x-hidden">
                {/* Sidebar */}
                <SidebarModal
                    isOpen={isOpen}
                    openSidebar={openSidebar}
                    closeSidebar={closeSidebar}
                />

                {/* Content */}
                <div className="relative flex-1 min-h-[1472px] sm:min-h-[1504px] overflow-x-hidden sm:border-l-4">
                    <Profile isProfileOpen={isProfileOpen} closeProfile={closeProfile} />
                    <div className={`relative ${isProfileOpen && 'hidden sm:block'}`}>
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout;
