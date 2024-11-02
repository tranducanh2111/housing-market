import React from 'react';
import SidebarModal from './Sidebar'; // Import the SidebarModal component

// Layout component definition
const Layout = ({ children, isOpen, openSidebar, closeSidebar }) => {
    return (
        <>
            <main className="flex justify-start overflow-x-hidden">
                {/* Sidebar */}
                <SidebarModal
                    isOpen={isOpen} // Boolean indicating if the sidebar is open
                    openSidebar={openSidebar} // Function to open the sidebar
                    closeSidebar={closeSidebar} // Function to close the sidebar
                />

                {/* Content Area */}
                {/* This div serves as the main content area that will adjust based on sidebar visibility */}
                <div className="relative flex-1 min-h-screen overflow-x-hidden sm:border-l-4">
                    <div className={`relative`}>
                        {children} {/* Render the children passed to the Layout component */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout; // Export the Layout component
