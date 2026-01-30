"use client";
import React from "react";
import { Facebook, Youtube, X, Instagram } from "lucide-react";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

const MainFooter = () => {
  const t = useTranslations();
  const items = [
    {
      icon: <Facebook size={18} />,
      label: "Facebook",
      onClick: () => alert("Home!"),
    },
    {
      icon: <X size={18} />,
      label: "X",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <Youtube size={18} />,
      label: "Youtube",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <Instagram size={18} />,
      label: "Instagram",
      onClick: () => alert("Settings!"),
    },
  ];
  return (
    <section className="bg-black text-white pt-16 pb-6 rounded-tr-[50px] overflow-hidden md:w-[95%] w-full">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-10 px-4 lg:px-20 lg:mt-16 mt-8">
        {/* MIDDLE: About */}
        <div className="space-y-4 col-span-2 xl:col-span-1">
          <h4 className="text-xl font-semibold">Econelo</h4>
          <div className="w-10 h-[2px] bg-primary mb-2" />
          <p className="text-gray-400 leading-relaxed">{t("footerDes")}</p>
          <a
            href="https://geizhals.de"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit"
          >
            <Image
              src="https://gzhls.at/b/brands/geizhals_logo_official.svg"
              width={120}
              height={60}
              alt="Geizhals Preisvergleich"
              priority
            />
          </a>
        </div>

        {/* COMPANY INFO */}
        <div className="space-y-4 col-span-2 xl:col-span-1">
          <h4 className="text-xl font-semibold">{t("companyInfo")}</h4>
          <div className="w-10 h-[2px] bg-primary mb-2" />
          <ul className="space-y-2 text-gray-400">
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href="/ueber-uns">{t("aboutUs")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href="/alle-produkte">{t("ourProducts")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href="/kontakt">{t("contactUs")}</Link>
            </li>
          </ul>
        </div>

        {/* POLICIES */}
        <div className="space-y-4 col-span-2 xl:col-span-1">
          <h4 className="text-xl font-semibold">{t("ourPolicy")}</h4>
          <div className="w-10 h-[2px] bg-primary mb-2" />
          <ul className="space-y-2 text-gray-400">
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href={`/agb`}>{t("termCondition")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              »{" "}
              <Link href={`/datenschutzerklaerung`}>{t("privacyPolicy")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href={`/versandbedingungen`}>{t("shippingPolicy")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href={`/zahlungsbedingungen`}>{t("paymentTerms")}</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href={`/widerrufsbelehrung`}>Widerruf</Link>
            </li>
            <li className="hover:pl-2 transition-all duration-500 hover:text-white">
              » <Link href={`/impressum`}>{t("imprint")}</Link>
            </li>
          </ul>
        </div>

        {/* QUICK CONTACT */}
        <div className="space-y-4 col-span-2 xl:col-span-1">
          <h4 className="text-xl font-semibold">{t("quickContact")}</h4>
          <div className="w-10 h-[2px] bg-primary mb-2" />
          <div className="space-y-2">
            <div className="text-primary font-bold text-lg">
              Anfragen Händler und Medienagenturen
            </div>
            <>
              <p className="text-gray-400 leading-relaxed max-w-xs">
                Andreas Bachl
              </p>
              <p className="text-gray-400 leading-relaxed max-w-xs">
                Key Account Manager DACH
              </p>
            </>
            {/* <div className="text-gray-400">+49 30 814 537 080</div> */}
            {/* <div className="text-gray-400">004368110327073</div> */}
            <div className="text-gray-400">andreas.bachl@prestige-home.de</div>
            {/* <p className="text-gray-400">{t("feelFree")}</p> */}
          </div>
          <div className="space-y-2">
            <div className="text-primary font-bold text-lg">
              {t("repairService")}
            </div>
            <p className="text-gray-400 leading-relaxed">Herr Frank Rafael</p>
            {/* <p className="text-gray-400">+49 1716 133971</p> */}
            <p className="text-gray-400">frank@frawa-aktiv.de</p>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center items-center">
        <a
          href="https://geizhals.de"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit"
        >
          <Image
            src="https://gzhls.at/b/brands/geizhals_logo_official.svg"
            width={120}
            height={60}
            alt="Geizhals Preisvergleich"
            priority
          />
        </a>
      </div> */}

      {/* BOTTOM FOOTER */}
      <div className="mt-16 border-t border-gray-800 pt-8 px-8 lg:px-20 flex flex-col-reverse lg:flex-row justify-between items-center gap-6">
        {/* COPYRIGHT */}
        <div className="text-gray-500 text-sm text-center">
          Copyright © 2025{" "}
          <span className="text-white">Prestige Home Gmbh.</span> All Rights
          Reserved.
        </div>

        {/* SOCIALS */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:bg-primary hover:text-white group transition-all duration-300 rounded-sm"
          >
            <Facebook className="w-4 h-4 group-hover:scale-125 duration-600" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MainFooter;
