import React from "react";
import  PuppyAttributes  from "./PuppyAttributes";

const puppyData = [
  {
    value: "item-1",
    triggerText: "Vet Wellness Exam",
    contentText: "Routine check-up to assess overall health.",
    icon: "/Health.svg",
  },
  {
    value: "item-2",
    triggerText: "Dry Food Trained",
    contentText: "Eats dry food comfortably.",
    icon: "/Food.svg",
  },
  {
    value: "item-3",
    triggerText: "Potty Trained",
    contentText: "Trained to use designated potty area.",
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
    contentText: "Trained to drink plain tap water as their daily hydration source.",
    icon: "/Water.svg",
  },
  {
    value: "item-6",
    triggerText: "AKC Registered",
    contentText: "Registered with the American Kennel Club, confirming purebred status and standards.",
    icon: "/certificate.svg",
  },
  {
    value: "item-7",
    triggerText: "3 Rounds of DA2PP Vaccination",
    contentText: "Vaccinated against major diseases like distemper, adenovirus, parainfluenza, and parvovirus for strong immunity.",
    icon: "/Syringe.svg",
  },
  {
    value: "item-8",
    triggerText: "Gene Family Tree Certificate",
    contentText: "A detailed lineage certificate showing the puppy’s purebred family history.",
    icon: "/Tree.svg",
  },
  {
    value: "item-9",
    triggerText: "2 Deworming Treatments",
    contentText: "Protected from common intestinal parasites to ensure healthy growth.",
    icon: "/Dog.svg",
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
