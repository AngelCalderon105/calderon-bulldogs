import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

interface PuppyAttributeProps {
  value: string;
  triggerText: string;
  contentText: string;
  icon: string;
}

export default function PuppyAttributes({
  value,
  triggerText,
  contentText,
  icon,
}: PuppyAttributeProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        key={value}
        value={value}
        className="m-3 md:mx-3 text-gray-600"
      >
        <AccordionTrigger>
          <div className="flex items-center gap-4">
            {typeof icon === "string" ? (
              <img
                src={icon}
                alt={`${triggerText} icon`}
                className="h-10 w-10"
              />
            ) : (
              icon
            )}
            <span className="text-start text-xl lg:text-2xl w-full md:w-52 lg:w-72 xl:w-full">
              {triggerText}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-lg ml-7 sm:ml-16 md:ml-6 w-10/12">
          {contentText}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
