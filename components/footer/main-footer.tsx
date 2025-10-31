import React from "react";
import { Mail, ArrowRight, Facebook, Youtube, Linkedin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MainFooter = () => {
    return (
        <section className="bg-black text-white pt-16 pb-6 rounded-tr-[50px] overflow-hidden md:w-[95%] w-full">
            <div className="flex flex-col lg:flex-row justify-center gap-10 px-8 lg:px-20">
                {/* LEFT: Subscribe */}
                <div className="bg-primary p-10 rounded-md w-full lg:w-1/3 space-y-5">
                    <Mail className="w-12 h-12 text-white" />
                    <h3 className="text-2xl font-bold text-white leading-snug">
                        Sign up for Electric Car, news & insights
                    </h3>

                    <div className="space-y-3">
                        <label htmlFor="email" className="text-sm font-medium text-white">
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white text-black border-none focus-visible:ring-0"
                        />
                        <Button className="bg-black text-white px-8 py-6 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                            SUBSCRIBE
                        </Button>
                    </div>
                </div>

                {/* MIDDLE: About */}
                <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-semibold">Grevo WP Theme</h4>
                    <div className="w-10 h-[2px] bg-primary mb-2" />
                    <p className="text-gray-400 max-w-md leading-relaxed">
                        A leading developer of A-grade commercial, electric car and bike projects
                        in USA. Since its foundation the company has doubled its turnover year on
                        year, with its staff numbers.
                    </p>
                    <a
                        href="#"
                        className="text-primary font-semibold inline-flex items-center gap-2 hover:underline"
                    >
                        Get a quote <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* COMPANY INFO */}
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Company info</h4>
                    <div className="w-10 h-[2px] bg-primary mb-2" />
                    <ul className="space-y-2 text-gray-400">
                        {["About Us", "Our Projects", "Meet Our Team", "News & Media", "Contact Us", "Careers"].map(
                            (item) => (
                                <li key={item} className="hover:text-white cursor-pointer transition">
                                    » {item}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* QUICK CONTACT */}
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Quick Contact</h4>
                    <div className="w-10 h-[2px] bg-primary mb-2" />
                    <p className="text-gray-400 leading-relaxed max-w-xs">
                        2307 Beverley Rd Brooklyn, New York 11226 United States.
                    </p>
                    <p className="text-gray-400">
                        If you have any questions or need help, feel free to contact with our team.
                    </p>
                    <div className="text-primary font-bold text-lg">(002) 01061245741</div>
                </div>
            </div>

            {/* BOTTOM FOOTER */}
            <div className="mt-16 border-t border-gray-800 pt-8 px-8 lg:px-20 flex flex-col lg:flex-row justify-between items-center gap-6">
                {/* LINKS */}
                <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
                    <a href="#" className="hover:text-white">
                        Where to Find Us
                    </a>
                    <span className="text-gray-600">|</span>
                    <a href="#" className="hover:text-white">
                        Terms of Payment
                    </a>
                    <span className="text-gray-600">|</span>
                    <a href="#" className="hover:text-white">
                        Stats Element
                    </a>
                </div>

                {/* COPYRIGHT */}
                <div className="text-gray-500 text-sm text-center">
                    Copyright © 2021 <span className="text-white">Grevo</span>. All Rights Reserved.
                </div>

                {/* SOCIALS */}
                <div className="flex items-center gap-3">
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:bg-primary hover:text-white transition rounded-sm"
                    >
                        <Facebook className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:bg-primary hover:text-white transition rounded-sm"
                    >
                        <X className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:bg-primary hover:text-white transition rounded-sm"
                    >
                        <Youtube className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:bg-primary hover:text-white transition rounded-sm"
                    >
                        <Linkedin className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default MainFooter;
