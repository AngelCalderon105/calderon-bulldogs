import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../components/ui/accordion";
  
  import React from "react";
  
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
            className="text-accordionText m-3 md:mx-3"
          >
            <AccordionTrigger>
              <div className="flex items-center gap-4 ">
                {typeof icon === "string" ? (
                  <img
                    src={icon}
                    alt={`${triggerText} icon`}
                    className="h-6 w-6"
                  />
                ) : (
                  icon
                )}
                <span className="text-start text-2xl w-80 md:w-52 lg:w-72 xl:w-96">
                  {triggerText}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-lg ml-7 sm:ml-16 md:ml-6 w-10/12 ">
              {contentText}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
     
    );
  }
  
  