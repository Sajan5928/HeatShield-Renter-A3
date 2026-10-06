/**
 * Accordion component — sourced from 21st.dev (shadcn/ui pattern).
 *
 * Adapted for HeatShield Renter:
 *  - Radix Accordion primitives (@radix-ui/react-accordion)
 *  - ChevronDownIcon from @radix-ui/react-icons
 *  - Styled via project CSS custom properties (tokens.css) — no Tailwind
 *  - "use client" directive removed (Vite project, not Next.js)
 *  - Ref types use concrete HTML element types (Radix Accordion renders
 *    Item/Content as <div> and Trigger as <button>)
 */

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("accordion-item", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="accordion-header">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn("accordion-trigger", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        width={16}
        height={16}
        className="accordion-chevron"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion-content"
    {...props}
  >
    <div className={cn("accordion-content-inner", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
