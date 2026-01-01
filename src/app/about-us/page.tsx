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

export default function AboutUsPage(){

const fillerText = "Lorem ipsum dolor sit amet consectetur. Dolor pretium ornare tortor eu malesuada. Sem trist arcu orci dictum. Sollicitudin ac lectus pulvinar cras molestie. Purus lobortis in vel ut orci est. Sem trist arcu orci dictum. Sollicitudin ac lectus pulvinar cras molestie."

    return (
        <div className = "about-us-page">

        {/* About Us Section */}
        <section style={{ background: "linear-gradient(160deg, #D6E5FF, #73A1F1)"}} className="relative z-0">
            <Image src={"/assets/puppies&paw.png"} alt="Puppies&Paws" width={1300} height={100} className="pt-20"/>

            <div className="pl-3 pt-8 md:pl-10 md:pt-16 lg:pl-16 lg:pt-24 absolute top-0 left-0">
                <h1 className="text-xl md:text-3xl lg:text-5xl font-bold font-georgia">About Us</h1>
                <p className="text-[#344EAD] text-sm text-md mt-1 lg:mt-4 font-semibold font-montserrat">Learn more about our story, our process and our family...</p>
            </div>
        </section>


        {/* Our Story */}
        <section className = "bg-white items-center px-4 py-12 relative w-full xl:max-w-100">        
            <div className = "grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Desktop */}
                <div className="hidden lg:flex lg:ml-14 lg:mt-8 w-[400px] h-[450px]">
                    <Image src={"/assets/owner.svg"} width={500} height={600} alt="dog-owner" className="rounded-2xl"></Image>
                </div>

                <div className="mb-24 text-center mx-auto lg:text-left flex flex-col lg:justify-center lg:-ml-10">
                    <h2 className = "text-3xl font-georgia font-bold mb-6">Our Story</h2>
                    <p className = "leading-loose text-black mb-8">{fillerText}</p>
                
                    {/* Mobile & Tablet */}
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Image src={"/assets/owner.svg"} width={500} height={600} alt="dog-owner" className="rounded-2xl"></Image>
                    </div>

                    
                    <div className="lg:w-[200px]">
                    <button className="bg-darker_blue font-montserrat text-white px-20 lg:px-14 py-2 rounded-full hover:bg-designblue">Contact Us</button>
                    </div>
                </div>

                
                <Image src={"/assets/smallRightPaw.svg"} alt="Paw-right" width={60} height={10} className="absolute md:w-[80px] left-[240px] top-[810px] md:left-[650px] md:top-[800px] lg:left-[950px] lg:top-[305px] xl:left-[1180px]"></Image>
                <Image src={"/assets/smallUpPaw.svg"} alt="Paw-straight" width={60} height={10} className="absolute md:w-[80px] left-[220px] top-[880px] md:left-[580px] md:top-[890px] lg:left-[890px] lg:top-[400px] xl:left-[1120px]"></Image>
                <Image src={"/assets/smallRightPaw.svg"} alt="Paw-right" width={65} height={10} className="absolute md:w-[85px] left-[235px] top-[940px] md:left-[620px] md:top-[960px] lg:left-[930px] lg:top-[480px] xl:left-[1160px]"></Image>
            </div>
            

            {/* Features */}
            <section>
                <div className="text-center mt-12 lg:mt-24">
                    <h2 className="font-semibold font-montserrat text-[#1E2D67] text-xl lg:text-2xl tracking-wide">Committed to Quality, Health, and Trust</h2>
                </div>

                <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-16 px-10 mt-10 text-center">
                    <FeatureCard imageSrc={"/certificate.svg"} imageAlt={"certificateLogo"} text={<>One Year<br />Health Guarantee</>}/>
                    <FeatureCard imageSrc={"/medal.svg"} imageAlt={"medalLogo"} text={<>American Kennel<br />Club Registered</>}/>
                    <FeatureCard imageSrc={"/Dog.svg"} imageAlt={"puppyLogo"} text={<>Breeding<br />Since 2018</>}/>
                </div>
            </section>
        </section>


        <HowItWorks/>


        {/* Available Puppies*/}
        <div className="flex">
            <div className="hidden lg:flex">
            <Image src="/assets/leftPaw.svg" alt="Paw-left" width={100} height={10} className="absolute mt-14 ml-3"></Image>
            <Image src="/assets/smallRightPaw.svg" alt="Paw-right" width={190} height={10} className="absolute ml-64 mt-44"></Image>
            <Image src="/assets/available_dog.png" alt="AvailableDog" width={450} height={10} className="absolute mt-16"></Image>
            </div>
                
            <div className="mx-auto lg:mr-40 mt-10 lg:mt-20 max-w-lg">
                <h2 className="text-3xl text-center lg:text-start font-georgia font-bold">Ready to Bring Happiness Home with Calderon Bulldogs?</h2>
                <p className="text-gray-700 text-center lg:text-start mt-6 mb-14 lg:mt-8 lg:mb-10">Browse our current available puppies and discover adorable puppies waiting for their forever home. </p>
                <button className="bg-[#f9d59e] font-montserrat font-semibold px-10 py-2 text-black rounded-full mt-8 block mx-auto lg:mx-0">View Available Puppies</button>
                
                <div className="lg:hidden">
                    <Image src="/assets/leftPaw.svg" alt="Paw-left" width={65} height={10} className="absolute mt-14 ml-3 md:mt-18 md:ml-10 md:w-[100px]"></Image>
                    <Image src="/assets/smallRightPaw.svg" alt="Paw-right" width={90} height={10} className="absolute mt-44 ml-48 md:mt-58 md:ml-72 md:w-[140px]"></Image>
                    <Image src="/assets/available_dog.png" alt="AvailableDog" width={450} height={10} className="absolute mt-16 md:ml-6"></Image>
                </div>
            </div>
        </div>
        </div>

    )
}