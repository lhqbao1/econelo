import React from "react";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const TopFooter = () => {
  const t = useTranslations();
  return (
    <section className="flex flex-col lg:flex-row justify-center lg:items-center items-start gap-8 md:gap-8 lg:gap-16 py-8 bg-white px-4 lg:px-0">
      {/* Hotline */}
      <div className="flex items-center gap-4">
        <PhoneCall
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />

        <div>
          <h4 className="font-bold text-lg text-black">{t("hotLine")}</h4>

          <a
            href="tel:+4930814537080"
            className="relative text-gray-700 text-base group"
          >
            <span className="inline-block">+49 30 814 537 080</span>

            {/* animated underline */}
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full rounded-full"></span>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block md:hidden w-px h-10 bg-gray-200"></div>

      {/* Email */}
      <div className="flex items-center gap-4">
        <Mail
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />

        <div>
          <h4 className="font-bold text-lg text-black">E-mail</h4>

          <a
            href="mailto:info@econelo.de"
            className="relative text-gray-700 text-base group inline-block cursor-pointer"
          >
            <span className="inline-block">info@econelo.de</span>

            {/* underline animation */}
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block md:hidden w-px h-10 bg-gray-200"></div>

      {/* Location */}
      <div className="flex items-center gap-4">
        <MapPin
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />

        <div>
          <h4 className="font-bold text-lg text-black">{t("ourLocation")}</h4>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Greifswalder%20Stra%C3%9Fe%20226"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-gray-700 text-base group inline-block cursor-pointer"
          >
            <span className="inline-block">Greifswalder Straße 226</span>

            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopFooter;
