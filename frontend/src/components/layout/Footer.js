import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'assets/icons/Logo.svg';
import FacebookIcon from 'assets/icons/facebook.svg';
import InstagramIcon from 'assets/icons/instagram.svg';
import TwitterIcon from 'assets/icons/twitter.svg';
import GithubIcon from 'assets/icons/github.svg';

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
        { name: 'About NextHome', link: '/' },
        { name: 'Meet Our Team', link: '/' },
        { name: 'Contact Us', link: '/' },
    ];

    const supportUsCategories = [
        { name: 'Raise Fund', link: '/' },
        { name: 'Collaborate', link: '/' },
    ];

    return (
        <section className="z-[39] relative">
            <div className="max-w-[78rem] px-5 mx-auto py-12 flex flex-col md:justify-start lg:flex-row lg:justify-between gap-y-12">
                <article className="flex flex-col items-between lg:items-start gap-6">
                    <img src={Logo} alt="SPPC Logo" className="object-fit w-full max-w-32" />
                    <span className="flex justify-start ml-[-1.5rem]">
                        {socials.map((social, index) => (
                            <div key={index} className="social_logo_item">
                                <a href={social.link} target="_blank" rel="noreferrer">
                                    <img
                                        src={social.logo}
                                        alt={social.name}
                                        width={20}
                                        height={20}
                                        className="mx-2"
                                    />
                                </a>
                            </div>
                        ))}
                    </span>
                </article>
                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    <article className="flex flex-col gap-2">
                        <h3 className="text-primary text-h3-sm sm:text-h3 mb-2">About Us</h3>
                        {aboutCategories.map((item, index) => (
                            <Link key={index} to={item.link} className="text-body-sm sm:text-body">
                                {item.name}
                            </Link>
                        ))}
                    </article>
                    <article className="flex flex-col gap-2">
                        <h3 className="text-primary text-h3-sm sm:text-h3 mb-2">Support Us</h3>
                        {supportUsCategories.map((item, index) => (
                            <Link key={index} to={item.link} className="text-body-sm sm:text-body">
                                {item.name}
                            </Link>
                        ))}
                    </article>
                </div>
            </div>

            <div className="bg-primary px-8 sm:px-[4.375rem] py-2">
                <div className="max-w-[78rem] mx-auto text-center sm:flex justify-between w-full m-auto py-2 text-white">
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
