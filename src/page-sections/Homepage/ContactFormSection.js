import React from 'react';
import Button from 'components/ultility/Button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactSection = () => {
    return (
        <div className="relative w-full pt-12 sm:pt-16 bg-cover bg-top bg-contact-image pb-5 lg:px-5">
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <div className="relative z-10 max-w-[78rem] py-15 mx-auto lg:flex lg:flex-row content-center lg:items-start lg:gap-4 xl:col xl:flex-row xl:items-start xl:justify-between mb-10 justify-around">
                <div className="pb-10 w-full lg:w-6/12 pl-5 xl:pl-0">
                    <h2 className="text-white text-h2-sm sm:text-h2 font-bold pb-2.5 text-center lg:text-left">
                        Let's keep in touch!
                    </h2>
                    <p className="text-white lg:max-w-[25rem] mx-auto lg:mx-0 xl:max-w-none text-body-sm sm:text-body text-center lg:text-left">
                        Our dedicated customer support team is available to assist you with any inquiries or concerns. Feel free to reach out, and we'll do our best to provide you with a prompt and helpful response.
                    </p>
                </div>
                {/* Form */}
                <div className="max-w-[78rem] sm:w-[31.25rem] mx-auto xl:mx-0 w-[90%]">
                    <div className='bg-white overflow-hidden rounded-lg p-7 lg:p-10' >
                        <div className={`flex flex-col items-center lg:items-start`}>
                            <h2 className={`text-h2-sm sm:text-h2 font-bold pb-2.5 text-center lg:text-left`}>Please fill this form</h2>
                            <p className='text-body-sm sm:text-body text-[#11181C] text-center lg:text-left'>
                                Stay updated on the latest news, promotions, and product releases by connecting with us on social media. We love engaging with our amazing community!
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 mt-8 mb-4">
                            <input type={"text"} placeholder={"Full name"} className="text-body-sm sm:text-body focus:border-primary hover:border-primary w-full rounded-md px-3 py-2 border border-light-grey placeholder:text-light-grey placeholder:text-body-sm sm:placeholder:text-body outline-none"></input>
                            <input type={"text"} placeholder={"Email"} className="text-body-sm sm:text-body focus:border-primary hover:border-primary w-full rounded-md px-3 py-2 border border-light-grey placeholder:text-light-grey placeholder:text-body-sm sm:placeholder:text-body outline-none"></input>
                            <PhoneInput
                                country="au"
                                placeholder="Phone number*"
                                inputClass="phone-input text-body-sm sm:text-body placeholder:text-body-sm sm:placeholder:text-body"
                                buttonClass="phone-input-dropdown"
                                searchClass="phone-input-flag"
                                value={null}
                            />
                            <input type={"text"} placeholder={"Message"} className="text-body-sm sm:text-body focus:border-primary hover:border-primary w-full rounded-md px-3 py-2 border border-light-grey placeholder:text-light-grey placeholder:text-body-sm sm:placeholder:text-body outline-none"></input>
                            
                            <div className="flex flex-row items-start text-body focus:border-primary">
                                <input type={"checkbox"} placeholder={"Message"} className="outline-none w-5 h-5 mr-3"></input>
                                <p className='text-body-sm sm:text-body'>
                                    I have read and accept the <strong>Terms of Service</strong> and{' '}
                                    <strong>Privacy Policy</strong>.
                                </p>
                            </div>
                        </div>
                        <Button title="Submit" className="bg-primary w-full text-white text-h5-sm sm:text-h5 justify-center" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;