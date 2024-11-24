"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavProps {
    isAdmin: boolean
  }

const Navigation: React.FC<NavProps> = ({isAdmin}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Disable scrolling when the menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; // Cleanup on unmount
        };
    }, [isOpen]);

    return (
        <div className="w-full top-0 flex justify-between md:px-2 py-4 md:pb-0 md:pt-4 z-50">
            {/* Logo and Title */}
            <div className="flex flex-row items-center">
                <Image src="/Vector.svg" alt="Logo" width={20} height={20} />
                <p className="font-georgia font-bold text-lg md:text-lg lg:text-xl px-2">
                    Calderon Bulldogs
                </p>
            </div>

            {/* Hamburger Icon for Mobile/Tablet */}
            <button
                className="block md:hidden text-black focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </button>

            {/* Mobile/Tablet Menu */}
            <div
                className={`fixed inset-0 pt-7 bg-blue_soft text-blue_darker flex flex-col w-full items-center transition-transform transform z-50 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } md:hidden`}
            >

                {/* Navigation Items */}
                <div className="flex flex-col items-center space-y-6 w-full px-8">
                    <div className="flex flex-row items-center justify-between w-full mb-8">
                        <div className="flex flex-row items-center">
                            <Image src="/Vector.svg" alt="Logo" width={30} height={30} />
                            <h1 className="font-georgia text-lg font-bold px-4">Calderon Bulldogs</h1>
                        </div>
                         {/* Close Button */}
                        <button
                            className="text-blue_darker"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                        
                    </div>

                    <ul className="space-y-4 w-full">
                        {["Available Puppies", "Stud Service", "FAQ"].map((item) => (
                            <li key={item} className="hover:bg-blue_soft rounded-lg">
                                <Link
                                    href="#"
                                    className={`flex items-center text-center p-3 rounded-lg text-blue_darker }`}
                                >
                                    <Image
                                        src="/Vector.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                        
                                    />
                                    <p className="text-lg font-medium font-sans px-3">{item}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link href="#" className="w-full">
                         <button className="mt-8 py-3 w-full rounded-full bg-blue_darker text-white font-semibold">
                            Contact Us
                        </button> 

                    </Link>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                {["Available Puppies", "Stud Service", "FAQ"].map((item) => (
                    <Link key={item} href="#">
                        <p className={`text-fray_dark font-medium`}>
                            {item}
                        </p>
                    </Link>
                ))}
                <Link href="#">
                    <button className="py-2 px-8 bg-primary text-white rounded-full">
                        Contact Us
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Navigation;
