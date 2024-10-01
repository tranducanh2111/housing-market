import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Button from 'components/ultility/Button';

// Import sponsor logos
import DeloitteLogo from 'assets/icons/deloitte.svg';
import TeslaLogo from 'assets/icons/tesla.svg';
import FacebookLogo from 'assets/icons/facebook-sponsor.svg';
import AWSLogo from 'assets/icons/aws.svg';
import TiktokLogo from 'assets/icons/tiktok.svg';
import GoogleLogo from 'assets/icons/google.svg';
import AccentureLogo from 'assets/icons/accenture.svg';
import XeroLogo from 'assets/icons/xero.svg';
import AppleLogo from 'assets/icons/apple.svg';
import CanvaLogo from 'assets/icons/canva.svg';
import OracleLogo from 'assets/icons/oracle.svg';
import SalesforceLogo from 'assets/icons/salesforce.svg';
import AdobeLogo from 'assets/icons/adobe.svg';
import CapgeminiLogo from 'assets/icons/capgemini.svg';
import EnvatoLogo from 'assets/icons/envato.svg';
import MicrosoftLogo from 'assets/icons/microsoft.svg';
import AlphabetLogo from 'assets/icons/alphabet.svg';
import NetflixLogo from 'assets/icons/netflix.svg';
import SonyLogo from 'assets/icons/sony.svg';
import NvidiaLogo from 'assets/icons/nvidia.svg';

import ThinArrow from 'assets/icons/thin-arrow.svg';

const SponsorList = () => {
    const sponsors = [
        { src: DeloitteLogo, alt: 'Deloitte' },
        { src: TeslaLogo, alt: 'Tesla' },
        { src: XeroLogo, alt: 'Xero' },
        { src: FacebookLogo, alt: 'Facebook' },
        { src: TiktokLogo, alt: 'Tiktok' },
        { src: GoogleLogo, alt: 'Google' },
        { src: CanvaLogo, alt: 'Canva' },
        { src: AccentureLogo, alt: 'Accenture' },
        { src: AppleLogo, alt: 'Apple' },
        { src: OracleLogo, alt: 'Oracle' },
        { src: SalesforceLogo, alt: 'Salesforce' },
        { src: AdobeLogo, alt: 'Adobe' },
        { src: CapgeminiLogo, alt: 'Capgemini' },
        { src: EnvatoLogo, alt: 'Envato' },
        { src: AWSLogo, alt: 'AWS' },
        { src: MicrosoftLogo, alt: 'Microsoft' },
        { src: AlphabetLogo, alt: 'Alphabet' },
        { src: NetflixLogo, alt: 'Netflix' },
        { src: SonyLogo, alt: 'Sony' },
        { src: NvidiaLogo, alt: 'Nvidia' },
    ];

    return (
        <section className="overflow-hidden flex flex-col flex-wrap items-center gap-[2rem] md:gap-[3rem]">
            <div className="flex flex-col items-center flex-wrap px-5 gap-y-[0.75rem] md:gap-y-[1rem] max-w-[650px] mx-auto">
                <h3 className="text-h3-sm md:text-h3 font-semibold text-center">
                    Join our valued sponsors and empowering healthier communities with critical data
                    insights
                </h3>
                <Button
                    title="Be our sponsors"
                    icon={ThinArrow}
                    className="text-primary text-body-sm sm:text-body"
                />
            </div>

            <Swiper
                modules={[Pagination, Autoplay]}
                className="justify-start items-start gap-6 inline-flex h-[128px] mask-gradient"
                spaceBetween={12}
                slidesPerView="auto"
                loop={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                }}
                speed={2500}
                breakpoints={{
                    768: {
                        centeredSlides: false,
                        spaceBetween: 12,
                    },
                    0: {
                        centeredSlides: true,
                        spaceBetween: 8,
                    },
                }}
            >
                {sponsors.map((sponsor, index) => (
                    <SwiperSlide
                        key={index}
                        className="justify-center items-center gap-1"
                        style={{
                            maxWidth: '200px',
                            width: '100%',
                            height: '128px',
                            display: 'flex',
                        }}
                    >
                        <img
                            src={sponsor.src}
                            alt={sponsor.alt}
                            width={128}
                            height={128}
                            loading="lazy"
                            className="bg-blend-screen"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default SponsorList;
