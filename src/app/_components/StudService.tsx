import React from "react";

const StudServiceCard: React.FC = () => {
  return (
    <div className="relative bg-blue_pastel overflow-hidden mx-auto py-20 border-none outline-none">
      {/* Top Wavy Background */}
      <div className="absolute top-0 left-0 w-full h-[150px]">
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,100 C50,200 150,0 250,100 C350,200 450,0 500,100 L500,0 L0,0 Z"
            className="fill-[white] md:block hidden"
          ></path>

          <path
            d="M0,100 C250,0 250,0 500,100 L500,0 L0,0 Z"
            className="fill-[white] md:hidden"
          ></path>
        </svg>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center px-8 space-y-10 md:space-y-0 md:gap-40">
        {/* Left Section: Text Content */}
        <div className="flex flex-col text-center space-y-4 md:space-y-8 max-w-[350px] lg:max-w-[600px]">
          <h2 className="text-2xl lg:text-3xl font-bold font-georgia text-blue_primary">
            Stud Service
          </h2>
          <p className="text-sm lg:text-lg text-gray_dark">
            <strong className="font-semibold text-custom-14">Meet Kratos</strong>, our
            exceptional Mini Lilac Tri-color English bulldog. Lilac Bulldogs are
            a result of double gene dilution, evolving from black through the
            influence of chocolate and blue genes. Kratos is perfect for your
            breeding program—visually appealing, compact, and friendly.
          </p>
          <button className="bg-blue_primary text-white py-2 px-7 rounded-full text-sm hover:bg-blue_dark mx-auto md:mx-0 self-center max-w-[220px] ">
            
            Contact Us for More Info
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="relative">
          <img
            src="/assets/stud_service.png"
            alt="Kratos"
            className="object-contain w-[250px] h-[250px] md:h-full md:w-10/12"
          />

          {/* Decorative Paw Prints */}
          <div className="absolute top-6 -right-6">
            <img
              src="/assets/Vector.svg"
              alt="Paw Print"
              className="w-9 h-9 md:w-11 md:h-11 lg:w-24 lg:h-24"
            />
          </div>
          <div className="absolute top-0">
            <img
              src="/assets/Vector (1).svg"
              alt="Paw Print"
              className="w-7 h-7 md:w-7 md:h-7 lg:w-16 lg:h-16"
            />
          </div>
          <div className="absolute bottom-0 -left-4">
            <img
              src="/assets/Vector (1).svg"
              alt="Paw Print"
              className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16"
            />
          </div>
        </div>
      </div>

      {/* Bottom Wavy Background */}
      <div className="absolute bottom-[-80px] left-0 w-full md:h-[150px] h-[120px]">
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,100 C50,200 150,0 250,100 C350,200 450,0 500,100 L500,500 L0,500 Z"
            className="fill-[white] md:block hidden"
          ></path>

          <path
            d="M0,100 C250,0 250,0 500,100 L500,200 L0,200 Z"
            className="fill-[white] md:hidden"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default StudServiceCard;
