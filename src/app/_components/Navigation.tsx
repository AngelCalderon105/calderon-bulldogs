"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full sticky flex justify-between items-center p-4">
            <div className="flex flex-row items-center">
                <Image src="/Vector.svg" alt="Logo" width={20} height={20} />
                <p className="font-georgia font-bold text-[20] md:text-[26] lg-text-[32] px-2">Calderon Bulldogs</p>
            </div>
            
            {/* Hamburger icon for mobile */}
            <button 
                className="block lg:hidden text-gray-800 focus:outline-none" 
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
            
            {/* Mobile Menu */}
            <div 
                className={`fixed inset-0 bg-gradient-to-b from-blue-500 to-blue-300 text-white flex flex-col items-center justify-center transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
            >
                {/* Close Button */}
                <button 
                    className="absolute top-4 right-4 text-white" 
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

                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-2xl font-bold mb-4">Calderon Bulldogs</h1>
                    
                    <ul className="space-y-4">
                        <li><Link href=""><p className="text-lg font-medium">Available Puppies</p></Link></li>
                        <li><Link href=""><p className="text-lg font-medium">Stud Service</p></Link></li>
                        <li><Link href=""><p className="text-lg font-medium">Gallery</p></Link></li>
                        <li><Link href=""><p className="text-lg font-medium">Blog</p></Link></li>
                        <li><Link href=""><p className="text-lg font-medium">About</p></Link></li>
                    </ul>

                    <Link href="">
                        <button className="mt-6 py-2 px-6 rounded-full bg-secblue text-white font-semibold text-[14px]">
                            Contact
                        </button>
                    </Link>
                </div>
            </div>

            {/* Menu for desktop */}
            <div className="hidden lg:flex flex-row items-center space-x-8">
                <ul className="flex space-x-8 items-center">
                    <li>
                        <Link href="">
                            <p className="text-navColor font-sans font-medium">Available Puppies</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="">
                            <p className="text-navColor font-sans font-medium">Stud Service</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="">
                            <p className="text-navColor font-sans font-medium">Gallery</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="">
                            <p className="text-navColor font-sans font-medium">Blog</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="">
                            <p className="text-navColor font-sans font-medium">About</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="">
                            <p className="rounded-full py-2 px-4 bg-secblue text-white flex items-center font-semibold text-[14px]">Contact</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navigation;
