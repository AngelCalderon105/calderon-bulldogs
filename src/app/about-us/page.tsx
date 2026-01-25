//Routing
//how it works
//2xl: max-w- for our story
//footer - fixing footer and removing div
//navigation - make layout absolute
//consistent nav and footer in home and about us page (check mobile)
//nav menu routing
import Image from "next/image";
import HowItWorks from "../_components/Howitworks";
import FeatureCard from "../_components/FeatureCard";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";

export default function AboutUsPage(){

const fillerText = "We are a family-owned puppy breeding business based in Santa Ana, proudly serving our community since 2018. We specialize in raising healthy, high-quality puppies with exceptional care from birth to their forever homes. Our family works closely with every customer to ensure the perfect match, offering deep knowledge in puppy care and professional stud services. We are committed to providing a smooth, trustworthy, and joyful experience for every new puppy family."

    return (
        <div className="overflow-x-hidden">
      
        <section style={{ background: "linear-gradient(140deg,rgb(255, 255, 255), #73A1F1)"}} className="relative overflow-hidden flex flex-col items-center justify-center ">
             <Navigation isAdmin={false} />
            <div className="relative z-10 flex flex-col justify-center m-5 mb-8 lg:mb-0 lg:items-center">
                <h1 className="text-2xl font-bold font-georgia sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ">About Us</h1>
                <p className="text-[#344EAD] font-semibold font-montserrat text-xs leading-4 sm:mt-2 sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl">Learn more about our story, our process and <span className="block md:hidden"></span><span className="hidden md:inline"> </span>our family...</p>
            </div>
            <Image 
                src={"/assets/puppies.png"} 
                alt="Puppies&Paws" 
                width={1800} 
                height={100} 
                className="relative -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-28 w-full h-auto max-h-[190px] sm:max-h-[226px] md:max-h-[302px] lg:max-h-[390px] xl:max-h-[454px] 2xl:max-h-[30vw] object-cover object-[50%_70%] 2xl:object-[50%_50%] z-0 md:hidden"
            />
            <Image 
                src={"/assets/about-us-hero.png"} 
                alt="About Us Hero" 
                width={1200} 
                height={100} 
                className="hidden md:block lg:mt-16 xl:mt-20 2xl:mt-24 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-5/12"
            />
          
        </section>
       

        {/* Our Story */}
        <section className=" overflow-x-hidden mx-10">        
            <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-0  md:my-10 items-center max-w-screen-xl mx-auto">
                    {/* Text Content - Right side on md+ */}
                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left order-1 md:order-2">
                        <h2 className = " text-2xl font-georgia font-bold my-5 md:mb-1 sm:text-4xl md:text-3xl lg:text-4xl  lg:mb-7 ">Our Story</h2>
                       
                        <p className = "text-black font-montserrat font-light leading-5 text-xs mb-8 md:mb-6 md:leading-5 px-4 md:px-0 sm:text-base lg:text-lg xl:text-xl max-w-2xl md:max-w-xl 2xl:max-w-xl 2xl:leading-9">{fillerText}</p>
                    
                        {/* Button - hidden on mobile, shown on md+ */}
                        <button className="hidden md:block bg-darker_blue font-montserrat font-semibold tracking-wide text-white my-6 md:my-0 px-20 sm:px-12 md:px-14 py-2 text-sm sm:text-base rounded-full hover:bg-designblue">Contact Us</button>
                    </div>

                    {/* Image - Left side on md+ */}
                    <div className="flex justify-center md:justify-center lg:justify-end lg:mr-14 order-2 md:order-1 ">
                        <Image src={"/assets/about-us-owner.png"} width={380} height={400} alt="dog-owner" className="rounded-xl"></Image>
                    </div>

                    {/* Button - shown on mobile only, appears after image */}
                    <div className="flex justify-center order-3 md:hidden">
                        <button className="bg-darker_blue font-montserrat font-semibold tracking-wide text-white mb-6 px-20 sm:px-24 py-2 text-sm sm:text-base rounded-full hover:bg-designblue">Contact Us</button>
                    </div>
                </div>

                {/* Paw Prints - positioned below filler text and maintaining ratio */}
                {/* Top paw: starts below filler text, maintaining ~5% spacing ratio between paws */}
                <Image 
                    src={"/vectorpaw.svg"} 
                    alt="Paw-right" 
                    width={45} 
                    height={500} 
                    className="opacity-40 absolute left-[90%] top-[100%] rotate-[30deg] w-[10vw] 
                    sm:left-[90%] sm:top-[100%] 
                    md:top-[80%] md:left-[90%] md:w-[6vw] 
                    lg:top-[82%] lg:left-[92%] lg:w-[6vw] 
                    xl:top-[75%] xl:left-[92%] xl:w-[5.5vw]
                    2xl:top-[70%] 2xl:left-[92%] 2xl:w-[5vw]
                    min-[2176px]:top-[97%] min-[2176px]:left-[92%] min-[2176px]:w-[4.5vw]"
                />
                
                {/* Middle paw: ~5% below top paw */}
                <Image 
                    src={"/vectorpaw.svg"} 
                    alt="Paw-right" 
                    width={45} 
                    height={500} 
                    className="opacity-40 z-0 absolute left-[80%] top-[106%] w-[10vw] 
                    sm:left-[78%] sm:top-[107%] 
                    md:top-[95%] md:left-[82%] md:w-[6vw] 
                    lg:top-[95%] lg:left-[85%] lg:w-[6vw] 
                    xl:top-[89%] xl:left-[83%] xl:w-[5.5vw]
                    2xl:top-[90%] 2xl:left-[85%] 2xl:w-[5vw]
                    min-[2176px]:top-[102%] min-[2176px]:left-[83%] min-[2176px]:w-[4.5vw]"
                />
               
                {/* Bottom paw: ~5% below middle paw */}
                <Image 
                    src={"/vectorpaw.svg"} 
                    alt="Paw-right" 
                    width={45} 
                    height={500} 
                    className="opacity-40 absolute left-[90%] top-[113%] rotate-[30deg] w-[10vw] 
                    sm:left-[91%] sm:top-[115%] 
                    md:top-[110%] md:left-[92%] md:w-[6vw] 
                    lg:top-[110%] lg:left-[92%] lg:w-[6vw] 
                    xl:top-[110%] xl:left-[92%] xl:w-[5.5vw]
                    2xl:top-[115%] 2xl:left-[92%] 2xl:w-[5vw]
                    min-[2176px]:top-[107%] min-[2176px]:left-[92%] min-[2176px]:w-[4.5vw]"
                />
            </div>
           

            {/* Features */}
            <section className="relative z-10 md:my-40">
                <div className="text-center mt-12 lg:mt-24">
                    <h2 className="font-semibold font-montserrat text-dark_blue text-xl sm:text-3xl xl:text-4xl px-4 relative z-10 ">Committed to Quality, Health, <span className="block md:hidden"></span><span className="hidden md:inline"> </span> and Trust</h2>
                </div>

                <div className="text-center  flex flex-col items-center gap-8 md:flex-row md:justify-evenly xl:justify-center md:items-stretch m-10">
                    <div className="w-10/12 max-w-72 md:w-[280px] md:max-w-[280px] md:h-full">
                        <FeatureCard imageSrc={"/certificate.svg"} imageAlt={"certificateLogo"} text={<>One Year<br />Health Guarantee</>}/>
                    </div>
                    <div className="w-10/12 max-w-72 md:w-[280px] md:max-w-[280px] md:h-full">
                        <FeatureCard imageSrc={"/assets/medal.svg"} imageAlt={"medalLogo"} text={<>American Kennel Club<br />Registered</>}/>
                    </div>
                    <div className="w-10/12 max-w-72 md:w-[280px] md:max-w-[280px] md:h-full">
                        <FeatureCard imageSrc={"/Dog.svg"} imageAlt={"puppyLogo"} text={<>Breeding<br />Since 2018</>}/>
                    </div>
                </div>
            </section>
        </section>


        <HowItWorks/>


        {/* Available Puppies Section*/}

        {/* Desktop View for Puppy */}
        <div className="relative flex flex-col lg:flex-row lg:justify-center lg:items-end lg:gap-8 xl:gap-12 2xl:gap-16 sm:px-6 shadow-lg ">
            <div className="hidden lg:block relative lg:flex-shrink-0 max-w-[500px] lg:max-w-[450px] xl:max-w-[550px] 2xl:max-w-[600px]">
            <Image src="/assets/adopt_puppy.png" alt="AvailableDog" width={450} height={450} className=" lg:w-[450px] xl:w-[470px] 2xl:w-[490px] object-contain"></Image>
            </div>
                
            <div className="mx-auto lg:mx-0 lg:py-20 mt-6 sm:mt-8 lg:mt-0 max-w-lg w-full lg:flex-shrink-0 lg:max-w-md">
                <h2 className="text-2xl sm:text-3xl text-center lg:text-start font-georgia font-bold px-2">Ready to Bring Happiness Home with Calderon Bulldogs?</h2>
                <p className="text-gray-700 font-montserrat text-center lg:text-start mt-4 sm:mt-6 mb-8 sm:mb-10 lg:mt-8 lg:mb-10 text-sm sm:text-base">Browse our current available puppies and discover adorable puppies waiting for their forever home. </p>
                <button className="bg-[#f9d59e] font-montserrat font-semibold px-8 sm:px-10 py-2 text-sm sm:text-base text-black rounded-full mt-6 sm:mt-8 block mx-auto lg:mx-0">View Available Puppies</button>
                {/* Mobile View for Puppy*/}
                <div className="lg:hidden relative mt-8 sm:mt-12 flex justify-center">
                    <div className="relative">  
                        <Image src="/assets/adopt_puppy.png" alt="AvailableDog" width={280} height={280} className="relative w-[300px] md:w-[350px] object-contain"></Image>
                    </div>
                </div>
            </div>
        </div>
        <div className="px-4 sm:px-6 my-12 sm:my-16 lg:my-20 lg:mx-10">
            <Footer />
        </div>

    </div>
    )
}