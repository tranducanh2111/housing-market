import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/icons/Logo.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import InstagramIcon from '../assets/icons/instagram.svg';
import TwitterIcon from '../assets/icons/twitter.svg';
import GithubIcon from '../assets/icons/github.svg';

const Footer = () => {
    const socials = [
        {
            name: 'Facebook',
            link: 'https://www.facebook.com/',
            logo: FacebookIcon, // Reference from public folder
        },
        {
            name: 'Instagram',
            link: 'https://www.instagram.com/',
            logo: InstagramIcon, // Reference from public folder
        },
        {
            name: 'Twitter',
            link: 'https://twitter.com/',
            logo: TwitterIcon, // Reference from public folder
        },
        {
            name: 'Github',
            link: 'https://github.com/',
            logo: GithubIcon, // Reference from public folder
        },
    ];

    const aboutCategories = [
        { name: 'About NextHome', link: '/about' },
        { name: 'Meet Our Team', link: '/teams' },
        { name: 'Contact Us', link: '/contact' },
    ];

    const supportUsCategories = [
        { name: 'Raise Fund', link: '/donate' },
        { name: 'Collaborate', link: '/volunteer' },
    ];

    return (
        <section className="z-[39] relative">
            <div className="max-w-[1170px] px-5 mx-auto py-[3rem] flex flex-col md:justify-start lg:flex-row lg:justify-between gap-y-[3rem]">
                <article className="flex flex-col items-between lg:items-start gap-[1.5rem]">
                    <img src={Logo} alt="SPPC Logo" className="object-fit w-full max-w-[8rem]" />
                    <span className="flex justify-start ml-[-8px]">
                        {socials.map((social, index) => (
                            <div key={index} className="social_logo_item">
                                <a href={social.link} target="_blank" rel="noreferrer">
                                    <img
                                        src={social.logo}
                                        alt={social.name}
                                        width={20}
                                        height={20}
                                        className="mx-[8px]"
                                    />
                                </a>
                            </div>
                        ))}
                    </span>
                </article>
                <div className="grid grid-cols-2 gap-x-[2rem] gap-y-[3rem]">
                    <article className="flex flex-col gap-[0.5rem]">
                        <h3 className="text-primary text-h3-sm sm:text-h3 mb-[0.5rem]">About Us</h3>
                        {aboutCategories.map((item, index) => (
                            <Link key={index} to={item.link} className="text-body-sm sm:text-body">
                                {item.name}
                            </Link>
                        ))}
                    </article>
                    <article className="flex flex-col gap-[0.5rem]">
                        <h3 className="text-primary text-h3-sm sm:text-h3 mb-[0.5rem]">Support Us</h3>
                        {supportUsCategories.map((item, index) => (
                            <Link key={index} to={item.link} className="text-body-sm sm:text-body">
                                {item.name}
                            </Link>
                        ))}
                    </article>
                </div>
            </div>

            <div className="bg-secondary px-[30px] sm:px-[70px] py-[8px]">
                <div className="max-w-[1170px] mx-auto text-center sm:flex justify-between w-[100%] m-auto py-2 text-white">
                    <p className="text-footnote-sm sm:text-footnote">
                        &copy; {new Date().getFullYear()} NextHome. All rights reserved.
                    </p>
                    <p className="text-footnote-sm sm:text-footnote">
                        Contact us:{' '}
                        <a href="mailto:Jungtalents@gmail.com">support@nexthome.com.au</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Footer;
