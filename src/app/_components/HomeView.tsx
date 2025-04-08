import Navigation from "./Navigation";

interface HomeProps {
  isAdmin: boolean;
}

const HomeView: React.FC<HomeProps> = ({ isAdmin }) => {
  return (
    <div
      className="flex justify-center"
      style={{ background: "linear-gradient(160deg, #D6E5FF, #73A1F1)" }}
    >
      <div className="px-5 lg:px-14">
        <Navigation isAdmin={isAdmin} />
        <div className="mt-4 flex max-w-7xl flex-col justify-center gap-8 px-4 md:flex-row md:justify-start lg:top-0">
          {/* Left Text Content */}
          <div className="flex flex-col items-center justify-center self-center text-center md:w-[70%] md:items-start md:justify-start md:text-left">
            <h1 className="font-georgia text-3xl font-semibold leading-tight md:text-[32px] xl:text-[48px]">
              Welcome to Calderon Bulldogs!
            </h1>
            <p className="py-6 font-sans text-[16px] font-semibold text-blue_darker xl:text-[22px]">
              From Our Family to Yours: Delivering Love, Trust, & Quality in
              Every Pup.
            </p>
            <button className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] px-10 py-2 text-center font-sans font-bold text-blue_darkest md:text-[16px] lg:px-20 lg:py-3 xl:text-[18px]">
              <a href="#contact ">Get In Touch</a>
            </button>
          </div>

          {/* Right Image Content */}
          <div className="self-end lg:flex lg:w-full lg:justify-center">
            <img
              src="/puppypawcover.png"
              alt="Cover Bulldog"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
