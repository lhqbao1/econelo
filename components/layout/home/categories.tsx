import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const categories = [
    {
        title: "Electric Scooters",
        image: "/category-section-image-1.png",
    },
    {
        title: "Electric Bikes",
        image: "/category-section-image-2.png",
    },
    {
        title: "City Mopeds",
        image: "/category-section-image-3.png",
    },
    {
        title: "Delivery Vehicles",
        image: "/category-section-image-4.png",
    },
];

const CategorySection = () => {
    return (
        <section className="w-full flex justify-center">
            <div className="w-11/12 lg:w-8/12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start px-6 bg-[#EFF3F5]/60 rounded-[40px] py-24 relative">
                {/* Left column */}
                <div className="space-y-6 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="uppercase text-sm font-semibold text-gray-600">
                            What we do!
                        </span>
                    </div>

                    <h2 className="text-4xl font-extrabold leading-snug text-black">
                        Our mission is to put an electric vehicle
                    </h2>

                    <p className="text-gray-500 text-base leading-relaxed max-w-md">
                        Charge your electric vehicle at home using one of our smart home
                        charge solutions or gain access to over 3,000 public charging bays
                        across the country.
                    </p>

                    {/* <div>
                        <Image
                            src="/category-section-image-2.png"
                            alt="Electric scooter"
                            width={450}
                            height={300}
                            className="object-contain absolute -bottom-0 -left-10"
                        />
                    </div> */}
                </div>

                {/* Right side - grid 2x2 categories */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
                        >
                            {/* Background image */}
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500"></div>

                            {/* Category content */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center transition-all duration-500">
                                <h3 className="text-2xl font-semibold mb-4">{cat.title}</h3>

                                <Button
                                    variant="outline"
                                    className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border-white text-black hover:bg-white hover:text-black"
                                >
                                    View More →
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
