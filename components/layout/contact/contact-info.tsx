import { Home, Mails, PhoneCall } from "lucide-react";
import React from "react";

const ContactInfo = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="w-11/12 lg:w-7/12 py-24 relative">
        {/* Header */}
        <div className="relative z-10 text-center space-y-6 mb-10">
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              Get in touch
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            We’d Love To Help You
          </h2>
          <div className="flex justify-center">
            <p className="md:w-3/4 w-full">
              Please feel free to get in touch using the form below. We’d love
              to hear your thoughts & answer any questions you may have!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <div className="flex items-center gap-4 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-tl-3xl rounded-br-3xl px-8 py-8 hover:bg-black hover:text-white group transition-colors duration-400">
            <Home className="text-primary size-16" strokeWidth={1} />
            <div className="">
              <h3 className="font-bold text-xl text-black group-hover:text-white">
                Our location
              </h3>
              <p className="text-gray-400 font-semibold">
                456, Lorem Street, New York,33454, NY.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-tl-3xl rounded-br-3xl px-8 py-8 hover:bg-black hover:text-white group transition-colors duration-400">
            <PhoneCall className="text-primary size-16" strokeWidth={1} />
            <div className="">
              <h3 className="font-bold text-xl text-black group-hover:text-white">
                Phone Number
              </h3>
              <p className="text-gray-400 font-semibold">+43 68110 327073</p>
            </div>
          </div>

          <div className="flex items-center gap-4 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-tl-3xl rounded-br-3xl px-8 py-8 hover:bg-black hover:text-white group transition-colors duration-400">
            <Mails className="text-primary size-16" strokeWidth={1} />
            <div className="">
              <h3 className="font-bold text-xl text-black group-hover:text-white">
                Email Address
              </h3>
              <p className="text-gray-400 font-semibold">
                andreas.bachl@prestige-home.de
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
