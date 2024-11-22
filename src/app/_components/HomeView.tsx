import Navigation from "./Navigation";

interface HomeProps {
    isAdmin: boolean
  }

const HomeView: React.FC<HomeProps> = ({isAdmin}) => {
    return (
        <div className="px-5 lg:px-14" style={{ background: "linear-gradient(160deg, #D6E5FF, #73A1F1)" }}>
            <Navigation isAdmin={isAdmin}/>
            <div className="flex flex-col md:flex-row lg:top-0 gap-8 mt-4  justify-center md:justify-start px-4 ">
                
                {/* Left Text Content */}
                <div className="flex flex-col justify-center self-center items-center md:items-start  md:justify-start text-center md:text-left md:w-[50%] ">
                    <h1 className="font-georgia font-semibold  text-3xl md:text-[32px] xl:text-[48px] leading-tight">
                        Welcome to Calderon Bulldogs!
                    </h1>
                    <p className=" py-6 font-sans text-secblue font-semibold text-[16px]  xl:text-[22px]">
                        From Our Family to Yours: Delivering Love, Trust, & Quality in Every Pup.
                    </p>
                    <button className=" font-bold py-2 px-10 md:py-3 md:px-20 rounded-full font-sans bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] text-buttonblue text-center  md:text-[16px] xl:text-[18px]">
                        Get In Touch
                    </button>
                </div>

                {/* Right Image Content */}
                <div className="lg:flex lg:justify-center lg:w-full self-end ">
                    <img 
                        src="/cover.png" 
                        alt="Cover Bulldog" 
                        className="object-contain lg:w-9/12 " 
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeView;
