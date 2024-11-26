import React from "react";
import  PuppyAttributes  from "./PuppyAttributes";

const puppyData = [
  {
    value: "item-1",
    triggerText: "Vet Wellness Exam",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Health.svg",
  },
  {
    value: "item-2",
    triggerText: "Dry Food Trained",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Food.svg",
  },
  {
    value: "item-3",
    triggerText: "Potty Trained",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Paw.svg",
  },
  {
    value: "item-4",
    triggerText: "Puppy Starter Kit",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Bone.svg",
  },
  {
    value: "item-5",
    triggerText: "Drinks Tap Water",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Water.svg",
  },
  {
    value: "item-6",
    triggerText: "AKC Registered",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/Certificate.svg",
  },
  {
    value: "item-7",
    triggerText: "3 Rounds of DA2PP Vaccination",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/syringe.svg",
  },
  {
    value: "item-8",
    triggerText: "Gene Family Tree Certificate",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/tree.svg",
  },
  {
    value: "item-9",
    triggerText: "2 Deworming Treatments",
    contentText: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "/dog.svg",
  },
];

export const PuppyAttributesGrid = () => {
  return ( 
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
      {puppyData.map((item) => (
        <PuppyAttributes
          key={item.value}
          value={item.value}
          triggerText={item.triggerText}
          contentText={item.contentText}
          icon={item.icon}
        />
      ))}
    </div>
  );
};
