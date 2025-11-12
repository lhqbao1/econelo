"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shared/styled-accordion";

const CommonQuestions = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="w-11/12 lg:w-7/12 py-24 relative">
        {/* Header */}
        <div className="relative z-10 text-center space-y-6 mb-10">
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              Common Questions
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            Frequently Asked Questions
          </h2>
          <div className="flex justify-center">
            <p className="md:w-3/4 w-full">
              You will find answers to about our electric vehicles and electric
              vehicle specialists service and more. Please feel free to contact
              us if you don't get your question's answer in below.
            </p>
          </div>
        </div>

        {/* Content */}
        <Accordion type="single" collapsible className="w-full">
          {/* Product Information */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our electric vehicles use high-performance Lithium-ion
                batteries, offering an average range of 50–120 km per charge.
              </p>
              <p>
                Maximum speed reaches up to 25 km/h (following local traffic
                regulations) with a waterproof design (IPX4) suitable for light
                rain.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Charging & Battery */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Charging & Battery</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Full charge takes approximately 4–6 hours with the included
                charger.
              </p>
              <p>
                Removable battery allows convenient indoor charging. Smart
                battery indicators alert you when 20% capacity remains.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Shipping & Delivery */}
          <AccordionItem value="item-3">
            <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We provide nationwide shipping through trusted courier partners.
              </p>
              <p>
                Typical delivery time ranges from 3–7 days depending on your
                location. Every order is securely packaged with detailed
                instructions.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Warranty & Return Policy */}
          <AccordionItem value="item-4">
            <AccordionTrigger>Warranty & Return Policy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                All electric vehicles come with a 12-month warranty for
                batteries and electronic components.
              </p>
              <p>
                Returns or exchanges are supported within 14 days for technical
                defects or shipping damage. Customer service is ready to assist
                with warranty claims.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Safety & Usage */}
          <AccordionItem value="item-5">
            <AccordionTrigger>Safety & Usage</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Always wear a helmet and follow traffic rules. Do not exceed
                recommended speeds and avoid slippery roads.
              </p>
              <p>
                Perform regular cleaning and maintenance to ensure long-term
                durability of your electric vehicle.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default CommonQuestions;
