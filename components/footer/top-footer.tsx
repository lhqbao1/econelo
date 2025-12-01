import React from "react";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const TopFooter = () => {
  const t = useTranslations();
  return (
    <section className="flex flex-col lg:flex-row justify-center lg:items-center items-start gap-8 md:gap-16 py-8 bg-white px-4 lg:px-0">
      {/* Hotline */}
      <div className="flex items-center gap-4">
        <PhoneCall
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />
        <div>
          <h4 className="font-bold text-lg text-black">{t("hotLine")}</h4>
          <p className="text-gray-700 text-base">+49 3222 1808038</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-10 bg-gray-200"></div>

      {/* Email */}
      <div className="flex items-center gap-4">
        <Mail
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />
        <div>
          <h4 className="font-bold text-lg text-black">E-mail</h4>
          <p className="text-gray-700 text-base">info@prestige-home.de</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-10 bg-gray-200"></div>

      {/* Location */}
      <div className="flex items-center gap-4">
        <MapPin
          className="text-primary w-10 h-10"
          strokeWidth={1.5}
        />
        <div>
          <h4 className="font-bold text-lg text-black">{t("ourLocation")}</h4>
          <p className="text-gray-700 text-base">Greifswalder Straße 226</p>
        </div>
      </div>
    </section>
  );
};

export default TopFooter;
