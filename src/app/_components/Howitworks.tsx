import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-blue_light_lg pt-12 px-8">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-center lg:justify-start lg:gap-60 lg:pl-16 pb-10 ">
        {/* Left Section: Steps */}
        <div className="relative flex flex-col space-y-12 max-w-[425px]">
          <h2 className="text-2xl lg:text-3xl font-georgia font-bold text-center md:text-start lg:text-start text-blue_primary -mt-4 lg:">How It Works</h2>

          {/* Dotted Line */}
          <div className="absolute top-[69px] left-[5px] h-400px max-[367px]:h-[320px] md:h-[295px] custom-range-368-767:h-[270px] max-[340px]:h-350px custom-range-343-367:h-[320px] custom-range-300-307:h-[380px] custom-range-300-307:left-[1px]">
            <img
              src="/assets/Vector 2751.png" // Replace with actual path
              alt="Dotted Line"
              className="h-full w-full"
            />
          </div>

          {/* Step 1 */}
          <div className="relative flex items-start space-x-6">
            <div className="relative flex flex-col items-center">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-darker_blue text-white flex items-center justify-center text-lg font-bold z-10">
                1
              </div>
            </div>
            <div>
              <h3 className="text-custom-16 md:text-xl font-semibold text-darker_blue">
                Book a Puppy Visit
              </h3>
              <p className="text-gray-700 text-custom-14 md:text-custom-16">
                Come meet the puppies, play with them, and ask any questions.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start space-x-6">
            <div className="relative flex flex-col items-center">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-darker_blue text-white flex items-center justify-center text-lg font-bold">
                2
              </div>
            </div>
            <div>
              <h3 className="text-custom-16 md:text-xl font-semibold text-darker_blue">
                Choose a Purchase Option
              </h3>
              <p className="text-gray_dark text-custom-14 md:text-custom-16">
                <span className="font-semibold text-darker_blue">Reserve</span> your puppy with a
                deposit, holding them for 30 days and allowing you to complete
                the purchase later. </p>
                <p className="text-gray_dark mt-2 text-custom-14 md:text-custom-16">
                or <span className="font-semibold text-darker_blue">Purchase</span> directly with full
                payment or PayPal's payment plan option.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-start space-x-6">
            <div className="relative flex flex-col items-center">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-darker_blue text-white flex items-center justify-center text-lg font-bold z-10">
                3
              </div>
            </div>
            <div>
              <h3 className="text-custom-16 md:text-xl font-semibold text-darker_blue">
                Bring Your Puppy Home
              </h3>
              <p className="text-gray_dark text-custom-14 md:text-custom-16">
                After purchase, schedule a pickup appointment and bring your
                puppy home.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Image and Button */}
        <div className="flex flex-col items-center space-y-8 -mt-4 lg:mt-12 md:mt-0">
          <div className="relative">
            <img
              src="/assets/stud_service.png"
              alt="Kratos"
              className="object-contain w-[300px] h-[300px] md:min-w-[350px] min-h-[350px]"
            />
          </div>
          <button className="bg-blue_darker font-montserrat text-white py-2 px-8 lg:px-10 rounded-full text-lg hover:bg-designblue">
            Still have questions?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
