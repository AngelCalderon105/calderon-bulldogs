import React from "react";

const StudServiceCard: React.FC = () => {
  return (
    <div className="relative mx-auto overflow-hidden border-none bg-blue_pastel py-20 outline-none">
      {/* Top Wavy Background */}
      <div className="absolute left-0 top-0 h-[150px] w-full">
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,100 C50,200 150,0 250,100 C350,200 450,0 500,100 L500,0 L0,0 Z"
            className="hidden fill-[white] md:block"
          ></path>

          <path
            d="M0,100 C250,0 250,0 500,100 L500,0 L0,0 Z"
            className="fill-[white] md:hidden"
          ></path>
        </svg>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-10 px-8 md:flex-row md:gap-40 md:space-y-0">
        {/* Left Section: Text Content */}
        <div className="flex max-w-[350px] flex-col space-y-4 text-center md:space-y-8 lg:max-w-[600px]">
          <h2 className="font-georgia text-2xl font-bold text-blue_primary lg:text-3xl">
            Stud Service
          </h2>
          <p className="text-sm text-gray_dark lg:text-lg">
            <strong className="text-custom-14 font-semibold">
              Meet Kratos
            </strong>
            , our exceptional Mini Lilac Tri-color English bulldog. Lilac
            Bulldogs are a result of double gene dilution, evolving from black
            through the influence of chocolate and blue genes. Kratos is perfect
            for your breeding program—visually appealing, compact, and friendly.
          </p>
          <button className="mx-auto max-w-[220px] self-center rounded-full bg-blue_primary px-7 py-2 text-sm text-white hover:bg-blue_dark md:mx-0">
            Contact Us for More Info
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="relative">
          <img
            src="/assets/stud_service.png"
            alt="Kratos"
            className="h-[250px] w-[250px] object-contain md:h-full md:w-10/12"
          />

          {/* Decorative Paw Prints */}
          <div className="absolute -right-6 top-6">
            <img
              src="/assets/Vector.svg"
              alt="Paw Print"
              className="h-9 w-9 md:h-11 md:w-11 lg:h-24 lg:w-24"
            />
          </div>
          <div className="absolute top-0">
            <img
              src="/assets/Vector (1).svg"
              alt="Paw Print"
              className="h-7 w-7 md:h-7 md:w-7 lg:h-16 lg:w-16"
            />
          </div>
          <div className="absolute -left-4 bottom-0">
            <img
              src="/assets/Vector (1).svg"
              alt="Paw Print"
              className="h-12 w-12 md:h-12 md:w-12 lg:h-16 lg:w-16"
            />
          </div>
        </div>
      </div>

      {/* Bottom Wavy Background */}
      <div className="absolute bottom-[-80px] left-0 h-[120px] w-full md:h-[150px]">
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,100 C50,200 150,0 250,100 C350,200 450,0 500,100 L500,500 L0,500 Z"
            className="hidden fill-[white] md:block"
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
