"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Available Puppies");

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
        <div className="w-full sticky top-0 flex justify-between items-center px-4 py-2 z-50">
            {/* Logo and Title */}
            <div className="flex flex-row items-center">
                <Image src="/Vector.svg" alt="Logo" width={30} height={30} />
                <p className="font-georgia font-bold text-lg md:text-2xl lg:text-3xl px-3">
                    Calderon Bulldogs
                </p>
            </div>

            {/* Hamburger Icon for Mobile/Tablet */}
            <button
                className="block md:hidden text-gray-800 focus:outline-none"
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
                className={`fixed inset-0 bg-blue-100 text-blue-900 flex flex-col items-center justify-center transition-transform transform z-50 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } md:hidden`}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-blue-900"
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

                {/* Navigation Items */}
                <div className="flex flex-col items-center space-y-6 w-full px-8">
                    <div className="flex flex-row items-center mb-8">
                        <Image src="/Vector.svg" alt="Logo" width={30} height={30} />
                        <h1 className="text-2xl font-bold">Calderon Bulldogs</h1>
                    </div>

                    <ul className="space-y-4 w-full">
                        {["Available Puppies", "Stud Service", "Gallery", "Blog", "About"].map((item) => (
                            <li key={item}>
                                <Link
                                    href="#"
                                    onClick={() => setActiveItem(item)}
                                    className={`flex items-center p-3 rounded-lg ${
                                        activeItem === item
                                            ? "bg-blue-300 text-blue-900"
                                            : "text-blue-700"
                                    }`}
                                >
                                    <Image
                                        src="/Vector.svg"
                                        alt="Icon"
                                        width={20}
                                        height={20}
                                        className="mr-3"
                                    />
                                    <p className="text-lg font-medium">{item}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link href="#">
                        <button className="mt-8 py-3 px-6 rounded-full bg-blue-900 text-white font-semibold">
                            Contact
                        </button>
                    </Link>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                {["Available Puppies", "Stud Service", "Gallery", "Blog", "About"].map((item) => (
                    <Link key={item} href="#">
                        <p
                            className={`text-gray-700 font-medium hover:text-blue-600 ${
                                activeItem === item ? "border-b-2 border-blue-600" : ""
                            }`}
                            onClick={() => setActiveItem(item)}
                        >
                            {item}
                        </p>
                    </Link>
                ))}
                <Link href="#">
                    <button className="py-2 px-4 bg-blue-900 text-white rounded-full">
                        Contact
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Navigation;
