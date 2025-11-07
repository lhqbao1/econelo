"use client";

import { Bike, CreditCard, Truck, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: "01",
    title: "Choose Your Model",
    desc: "Explore our wide range of electric scooters and bikes. Find the model that suits your lifestyle and daily needs.",
    icon: <Bike className="w-14 h-14 text-lime-500" />,
  },
  {
    id: "02",
    title: "Easy Financing",
    desc: "Flexible payment plans and financing options available. Drive home your dream electric vehicle with ease.",
    icon: <CreditCard className="w-14 h-14 text-lime-500" />,
  },
  {
    id: "03",
    title: "Fast Delivery",
    desc: "Once you place your order, we prepare and deliver your new e-vehicle quickly — ready to ride immediately.",
    icon: <Truck className="w-14 h-14 text-lime-500" />,
  },
  {
    id: "04",
    title: "After-Sales Support",
    desc: "Enjoy peace of mind with our full warranty and service support. We’re always here to keep your e-ride running smoothly.",
    icon: <Wrench className="w-14 h-14 text-lime-500" />,
  },
];

export default function StepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || cardsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%", // xuất hiện muộn hơn chút để tránh giật
          toggleActions: "play none none reverse", // hoặc "restart none none none"
        },
      });

      tl.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 100,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2, // stagger in from the left with a 0.1 second gap in between animations
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 bg-white flex flex-col items-center justify-center gap-8"
    >
      {/* Section Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
          <span className="uppercase text-sm font-semibold text-gray-600">
            Shopping Process
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-black">
          4 simple steps to get your electric vehicle
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl w-11/12 text-center">
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="flex flex-col items-center text-center group transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-lime-500/10 rounded-full w-24 h-24 -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 blur-sm"></div>
              {step.icon}
            </div>

            <h3 className="text-xl font-bold text-black mb-3">
              <span className="text-lime-500 font-bold mr-1">{step.id}.</span>
              {step.title}
            </h3>

            <p className="text-gray-500 text-base leading-relaxed max-w-[230px]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
