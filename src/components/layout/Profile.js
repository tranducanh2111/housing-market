import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use react-router for routing
import Button from '../ultility/Button'; // Adjust path as necessary
import ThinArrow from 'assets/icons/thin-arrow.svg'; // Adjust path as necessary
import LogOut from 'assets/icons/logout.svg'; // Adjust path as necessary

// Sample user data for demonstration
const sampleUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
    picture: '/default_avatar.jpg', // Default avatar path
};

const NavBarProfile = ({ isProfileOpen, closeProfile }) => {
    const [user] = useState(sampleUser); // Using sample user data

    const formatEmail = email => {
        const atIndex = email.indexOf('@');
        if (atIndex >= 0) {
            const prefix = email.substring(0, atIndex);
            const domain = email.substring(atIndex);
            const maskedPrefix = '*'.repeat(prefix.length - 3) + prefix.slice(-4);
            return maskedPrefix + domain;
        }
        return email;
    };

    const formatPhoneNumber = phoneNumber => {
        if (phoneNumber && phoneNumber.length >= 3) {
            const lastThreeDigits = phoneNumber.slice(-3);
            const maskedDigits = '*'.repeat(phoneNumber.length - 3);
            return maskedDigits + lastThreeDigits;
        }
        return phoneNumber;
    };

    const handleLogout = () => {
        // Placeholder for logout functionality
        console.log('User logged out');
    };

    return (
        <section>
            <div
                className={`absolute inset-0 z-20 ${
                    isProfileOpen ? 'block bg-black opacity-50' : 'hidden'
                }`}
                onClick={closeProfile}
            ></div>

            <div
                className={
                    isProfileOpen
                        ? 'absolute right-0 w-full sm:w-[517px] bg-[#ECECEC] px-[20px] py-[40px] sm:px-[30px] space-y-[40px] z-[1000] sm:rounded-[12px]'
                        : 'hidden'
                }
            >
                <div className="flex flex-col items-center bg-[#FFFFFF] w-full h-[184px] rounded-[8px] py-[12px] gap-[8px]">
                    {user.picture ? (
                        <img
                            alt={user.name || 'avatar'}
                            src={user.picture}
                            width={130}
                            height={130}
                            className="rounded-full border-[#FF5A1A] border-opacity-40 object-cover"
                        />
                    ) : (
                        <img
                            alt={"No User's Avatar"}
                            src={'/default_avatar.jpg'}
                            width={130}
                            height={130}
                            className="rounded-full border-[#FF5A1A] border-opacity-40 object-cover"
                        />
                    )}
                    <Link to="#" className="text-body text-primary">
                        Change Avatar
                    </Link>
                </div>

                <div className="bg-[#FFFFFF] py-[12px] px-[24px] rounded-[8px]">
                    <section className="flex justify-between py-[12px]">
                        <p>Name</p>
                        <p>{user.name || 'John Doe'}</p>
                    </section>
                    <section className="flex justify-between py-[12px]">
                        <p>Email</p>
                        <p>{formatEmail(user.email || '*******@example.com')}</p>
                    </section>
                    <section className="flex justify-between py-[12px]">
                        <p>Phone Number</p>
                        <p>{formatPhoneNumber(user.phone_number || '*******021')}</p>
                    </section>
                </div>

                <div className="bg-[#FFFFFF] py-[12px] px-[24px] rounded-[8px] space-y-[40px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[30px] font-[500] leading-[32px]">News</h2>
                        <Link
                            to="#"
                            className="flex items-center max-w-content h-[30px] text-primary px-1 py-[4px] rounded-[2px] ml-auto"
                        >
                            <Button className="font-medium" icon={ThinArrow} title="View more" />
                        </Link>
                    </div>
                </div>
                <Button
                    title="Log out"
                    icon={LogOut}
                    className="bg-primary w-full text-white text-h5 justify-center"
                    onClick={handleLogout}
                />
            </div>
        </section>
    );
};

export default NavBarProfile;
