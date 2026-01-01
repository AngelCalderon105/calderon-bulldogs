"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Contact from "./ContactView";

interface NavProps {
  isAdmin: boolean;
}

const Navigation: React.FC<NavProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Available Puppies", path: "#stud_service" },
    { name: "Stud Service", path: "#stud_service" },
    { name: "FAQ", path: "#faq" },
  ];

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
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-8">
        {/* Logo and Title */}
        <div className="flex flex-row items-center gap-2">
          <Image src="/Vector.svg" alt="Logo" width={24} height={24} className="md:w-6 md:h-6" />
          <p className="font-georgia text-lg font-bold md:text-xl lg:text-2xl">
            Calderon Bulldogs
          </p>
        </div>

        {/* Hamburger Icon for Mobile/Tablet */}
        <button
          className="block text-gray_dark focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
        <svg
          className="h-6 w-6"
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
        className={`fixed inset-0 z-50 flex w-full transform flex-col items-center bg-[#D6E5FF] pt-7 text-blue_darker transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        {/* Navigation Items */}
        <div className="flex w-full flex-col items-center space-y-6 px-8">
          <div className="mb-8 flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Image src="/Vector.svg" alt="Logo" width={30} height={30} />
              <h1 className="px-4 font-georgia text-lg font-bold">
                Calderon Bulldogs
              </h1>
            </div>
            {/* Close Button */}
            <button
              className="text-blue_darker"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-6 w-6"
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

          <ul className="w-full space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="group cursor-pointer rounded-lg hover:bg-blue_soft"
              >
                <Link
                  href={item.path}
                  className={`} flex items-center rounded-lg p-3 text-center text-blue_darker`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-blue_light_md transition-colors duration-300 group-hover:fill-blue_darker"
                  >
                    <path d="M24 8.84598C24 9.43933 23.8241 10.0193 23.4944 10.5127C23.1648 11.006 22.6962 11.3906 22.1481 11.6176C21.5999 11.8447 20.9967 11.9041 20.4147 11.7883C19.8328 11.6726 19.2982 11.3869 18.8787 10.9673C18.4591 10.5477 18.1734 10.0132 18.0576 9.43125C17.9419 8.84931 18.0013 8.24611 18.2284 7.69793C18.4554 7.14975 18.8399 6.68122 19.3333 6.35157C19.8266 6.02193 20.4067 5.84598 21 5.84598C21.7956 5.84598 22.5587 6.16205 23.1213 6.72466C23.6839 7.28727 24 8.05033 24 8.84598ZM6 8.84598C6 8.25264 5.82405 7.67262 5.49441 7.17927C5.16477 6.68592 4.69623 6.30141 4.14805 6.07434C3.59987 5.84728 2.99667 5.78787 2.41473 5.90363C1.83279 6.01938 1.29824 6.3051 0.878681 6.72466C0.459123 7.14422 0.173401 7.67877 0.0576455 8.26071C-0.0581102 8.84265 0.00129985 9.44585 0.228363 9.99403C0.455426 10.5422 0.839943 11.0107 1.33329 11.3404C1.82664 11.67 2.40666 11.846 3 11.846C3.79565 11.846 4.55871 11.5299 5.12132 10.9673C5.68393 10.4047 6 9.64163 6 8.84598ZM8.14286 6.70313C8.7362 6.70313 9.31622 6.52718 9.80957 6.19753C10.3029 5.86789 10.6874 5.39935 10.9145 4.85118C11.1416 4.303 11.201 3.6998 11.0852 3.11786C10.9695 2.53591 10.6837 2.00136 10.2642 1.58181C9.84462 1.16225 9.31007 0.876526 8.72813 0.76077C8.14619 0.645015 7.54299 0.704425 6.99481 0.931488C6.44663 1.15855 5.97809 1.54307 5.64845 2.03642C5.3188 2.52976 5.14286 3.10978 5.14286 3.70313C5.14286 4.49878 5.45893 5.26184 6.02154 5.82445C6.58415 6.38705 7.34721 6.70313 8.14286 6.70313ZM15.8571 6.70313C16.4505 6.70313 17.0305 6.52718 17.5239 6.19753C18.0172 5.86789 18.4017 5.39935 18.6288 4.85118C18.8558 4.303 18.9153 3.6998 18.7995 3.11786C18.6837 2.53591 18.398 2.00136 17.9785 1.58181C17.5589 1.16225 17.0244 0.876526 16.4424 0.76077C15.8605 0.645015 15.2573 0.704425 14.7091 0.931488C14.1609 1.15855 13.6924 1.54307 13.3627 2.03642C13.0331 2.52976 12.8571 3.10978 12.8571 3.70313C12.8571 4.49878 13.1732 5.26184 13.7358 5.82445C14.2984 6.38705 15.0615 6.70313 15.8571 6.70313ZM18.3343 13.2238C17.8989 12.9837 17.5152 12.66 17.205 12.2713C16.8949 11.8827 16.6644 11.4367 16.5268 10.9588C16.2418 9.97875 15.6464 9.11762 14.8301 8.50488C14.0138 7.89214 13.0207 7.56087 12 7.56087C10.9793 7.56087 9.9862 7.89214 9.1699 8.50488C8.3536 9.11762 7.75821 9.97875 7.47322 10.9588C7.19792 11.9203 6.55251 12.7333 5.67857 13.2196C4.8402 13.6732 4.177 14.3934 3.79385 15.2662C3.41071 16.1391 3.3295 17.1148 3.56306 18.0389C3.79663 18.9631 4.33164 19.7831 5.08347 20.3691C5.83531 20.9551 6.76105 21.2737 7.71429 21.2746C8.28553 21.2762 8.85119 21.1621 9.37714 20.9392C11.054 20.2476 12.9364 20.2476 14.6132 20.9392C15.6289 21.3809 16.7761 21.4123 17.8144 21.0267C18.8527 20.6412 19.7014 19.8686 20.1826 18.8711C20.6638 17.8735 20.7401 16.7284 20.3955 15.6758C20.0509 14.6232 19.3122 13.7448 18.3343 13.2249V13.2238Z" />
                  </svg>

                  <p className="px-3 font-sans text-lg font-medium">
                    {item.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#contact"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            <button className="mt-8 w-full rounded-full bg-blue_darker py-3 font-semibold text-white">
              Contact Us
            </button>
          </Link>
        </div>
      </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <Link href="#stud_service" className="transition-colors hover:text-blue_darker">
            <p className="font-medium text-gray_dark">Stud Service</p>
          </Link>

          <Link href="#faq" className="transition-colors hover:text-blue_darker">
            <p className="font-medium text-gray_dark">FAQs</p>
          </Link>

          <Link href="#contact">
            <button className="rounded-full bg-blue_darker px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue_primary lg:px-8 lg:text-base">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
