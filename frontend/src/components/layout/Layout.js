import React from 'react';
import SidebarModal from './Sidebar';

const Layout = ({ children, isOpen, openSidebar, closeSidebar }) => {
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
                {/* <div className="relative flex-1 min-h-[92rem] sm:min-h-[84rem] overflow-x-hidden sm:border-l-4"> */}
                <div className="relative flex-1 min-h-screen overflow-x-hidden sm:border-l-4">
                    <div className={`relative`}>
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout;
