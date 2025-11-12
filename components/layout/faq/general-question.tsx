"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shared/styled-accordion";

const GeneralQuestions = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="w-11/12 lg:w-7/12 py-24 relative">
        {/* Header */}
        <div className="relative z-10 text-center space-y-6 mb-10">
          <div className="flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="uppercase text-sm font-semibold text-gray-600">
              General Questions
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            Frequently Asked Questions
          </h2>
          <div className="flex justify-center">
            <p className="md:w-3/4 w-full">
              Find answers to general questions about our products, services,
              ordering process, and support. If you cannot find your answer,
              please reach out to our support team.
            </p>
          </div>
        </div>

        {/* Content */}
        <Accordion type="single" collapsible className="w-full">
          {/* Ordering & Payment */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Ordering & Payment</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                You can place orders online via our website. Multiple payment
                methods are available including credit card, PayPal, and bank
                transfer.
              </p>
              <p>
                For large orders, please contact our sales team for assistance
                and potential discounts.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Shipping & Delivery */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We ship nationwide with reliable courier services. Standard
                delivery takes 3–5 business days.
              </p>
              <p>
                Tracking information is provided for all shipments so you can
                monitor your package in real time.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Returns & Refunds */}
          <AccordionItem value="item-3">
            <AccordionTrigger>Returns & Refunds</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Returns are accepted within 14 days of delivery for non-damaged
                products in original packaging.
              </p>
              <p>
                Refunds are processed via the same payment method used for
                purchase. Customer support will guide you through the process.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Product Support */}
          <AccordionItem value="item-4">
            <AccordionTrigger>Product Support</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our support team can help with setup, troubleshooting, and
                maintenance questions.
              </p>
              <p>
                Support requests can be submitted via email, phone, or live chat
                during business hours.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Account & Privacy */}
          <AccordionItem value="item-5">
            <AccordionTrigger>Account & Privacy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                You can create an account to track orders, manage personal
                information, and save preferences.
              </p>
              <p>
                We take your privacy seriously and handle all personal data in
                accordance with GDPR.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default GeneralQuestions;
