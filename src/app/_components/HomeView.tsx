import Navigation from "./Navigation";

interface HomeProps {
    isAdmin: boolean
  }

const HomeView: React.FC<HomeProps> = ({isAdmin}) => {
    return (
        <div className="h-full md:h-screen px-8" style={{ background: "linear-gradient(160deg, #D6E5FF, #73A1F1)" }}>
            <Navigation isAdmin={isAdmin}/>
            <div className="flex flex-col lg:flex-row h-full items-center justify-center lg:justify-between">
                
                {/* Left Text Content */}
                <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left md:w-[50%] px-8 lg:px-12">
                    <h1 className="font-georgia font-bold text-[24px] md:text-[48px]">
                        Welcome to Calderon Bulldogs!
                    </h1>
                    <p className="mt-2 py-4 font-sans text-secblue font-semibold text-[16px] md:text-[22px]">
                        From Our Family to Yours: Delivering Love, Trust, & Quality in Every Pup.
                    </p>
                    <button className="font-bold py-3 px-4 rounded-full font-sans bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] text-buttonblue text-center w-[60%] text-[14px] md:text-[16px] lg:text-[18px]">
                        Get In Touch
                    </button>
                </div>

                {/* Right Image Content */}
                <div className="flex items-end justify-center md:justify-end w-full h-full lg:w-[70%] max-h-[80%]">
                    <img 
                        src="/cover.png" 
                        alt="Cover Bulldog" 
                        className="object-contain h-full" 
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeView;
