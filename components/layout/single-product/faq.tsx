"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqAccordion() {
  const faqs = [
    {
      question: "Is The High Roller suitable for all ages?",
      answer:
        "Absolutely! The High Roller offers a family-friendly experience suitable for visitors of all ages. Children must be accompanied by an adult.",
    },
    {
      question: "Can I bring food or drinks aboard The High Roller?",
      answer:
        "Outside food and beverages are not permitted on The High Roller. However, there are nearby dining options at The LINQ Promenade where you can enjoy a meal before or after your ride.",
    },
    {
      question: "Is The High Roller wheelchair accessible?",
      answer:
        "Yes, The High Roller cabins are wheelchair accessible, making it possible for everyone to enjoy the breathtaking views of Las Vegas.",
    },
  ];

  return (
    <Card className="p-6 rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Question Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg mb-3 bg-gray-50 px-3"
            >
              <AccordionTrigger className="text-base font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
