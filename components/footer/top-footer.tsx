import React from "react";
import { PhoneCall, Mail, MapPin } from "lucide-react";

const TopFooter = () => {
    return (
        <section className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 py-8 bg-white">
            {/* Hotline */}
            <div className="flex items-center gap-4">
                <PhoneCall className="text-primary w-10 h-10" strokeWidth={1.5} />
                <div>
                    <h4 className="font-bold text-lg text-black">Hot Line</h4>
                    <p className="text-gray-700 text-base">+(01) 1234-57-890</p>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            {/* Email */}
            <div className="flex items-center gap-4">
                <Mail className="text-primary w-10 h-10" strokeWidth={1.5} />
                <div>
                    <h4 className="font-bold text-lg text-black">E-mail Address</h4>
                    <p className="text-gray-700 text-base">grevoinfo@gmail.com</p>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

            {/* Location */}
            <div className="flex items-center gap-4">
                <MapPin className="text-primary w-10 h-10" strokeWidth={1.5} />
                <div>
                    <h4 className="font-bold text-lg text-black">Our Location</h4>
                    <p className="text-gray-700 text-base">101 Avenue, S.E. USA</p>
                </div>
            </div>
        </section>
    );
};

export default TopFooter;
