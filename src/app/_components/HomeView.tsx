import Navigation from "./Navigation";

const HomeView: React.FC = () => {
    return (
        <div className="h-screen px-8" style={{ background: "linear-gradient(160deg, #D6E5FF, #73A1F1)" }}>
            <Navigation />
            <div className="flex flex-col lg:flex-row h-full items-center justify-center lg:justify-between">
                
                {/* Left Text Content */}
                <div className="flex flex-col justify-center sm:items-center items-start text-left max-w-[80%] lg:max-w-[30%] px-8 lg:px-12">
                    <h1 className="font-georgia font-bold text-[36px] md:text-[40px] lg:text-[48px]">
                        Welcome to Calderon Bulldogs!
                    </h1>
                    <p className="mt-2 py-4 font-sans text-secblue font-semibold text-[14px] md:text-[16px] lg:text-[18px]">
                        From Our Family to Yours: Delivering Love, Trust, & Quality in Every Pup.
                    </p>
                    <button className="font-bold py-3 px-4 rounded-full font-sans bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] text-buttonblue text-center w-[60%] md:w-[40%] lg:w-auto  text-[14px] md:text-[16px] lg:text-[18px]">
                        Get In Touch
                    </button>
                </div>

                {/* Right Image Content */}
                <div className="flex items-end sm:justify-center justify-end w-full lg:w-[70%] h-full max-h-[30%] lg:max-h-[80%]">
                    <img src="/cover.png" alt="Cover Bulldog" className="object-cover h-full" />
                </div>
            </div>
        </div>
    );
};

export default HomeView;
