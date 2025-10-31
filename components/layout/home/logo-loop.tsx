"use client";

import LogoLoop from "@/components/LogoLoop";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

const imageLogos = [
    { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
    { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
    { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];

const LogoLoopSection = () => {
    return (
        <section className="relative w-full py-16 bg-white flex justify-center items-center overflow-hidden">
            <div className="w-11/12 lg:w-8/12 h-[200px] relative">
                <LogoLoop
                    logos={techLogos} // hoặc đổi sang imageLogos nếu dùng ảnh
                    speed={120}
                    direction="left"
                    logoHeight={48}
                    gap={40}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#ffffff"
                    ariaLabel="Technology partners"
                />
            </div>
        </section>
    );
};

export default LogoLoopSection;
