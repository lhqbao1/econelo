"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      {...props}
      className="space-y-6"
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 cursor-pointer shadow-[0_0_20px_0_rgb(92_107_149_/11%)] px-6 flex flex-1 items-start justify-between gap-4 rounded-tl-xl rounded-br-xl py-4 text-left text-base font-bold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          "data-[state=open]:bg-black data-[state=open]:text-white", // ✅ thêm đây
          className
        )}
        {...props}
        onClick={(e) => {
          setIsOpen((prev) => !prev);
          if (props.onClick) props.onClick(e);
        }}
      >
        {children}
        {isOpen ? (
          <Minus
            className="text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
            strokeWidth={4}
          />
        ) : (
          <Plus
            className="text-primary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
            strokeWidth={4}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down duration-200 overflow-hidden px-6 pt-4 text-base"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
