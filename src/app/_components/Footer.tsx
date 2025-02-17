import PawLogo from "../../../public/PawLogo.svg"; 
import InstaLogo from "../../../public/InstagramLogo.svg"
import TiktokLogo from "../../../public/TiktokLogo.svg"
import PhoneIcon from "../../../public/PhoneIcon.svg"
import MailIcon from "../../../public/MailIcon.svg"
import LocationIcon from "../../../public/LocationIcon.svg"
export default function Footer() {
    return (
        <footer className="text-dark_blue">
            <div className="lg:flex">
                {/* Logo and Social Media */}
                <div className="flex flex-col lg:w-4/12 mt-10 justify-center items-center lg:justify-start ">
                    <h2 className="font-bold text-lg flex items-center lg:flex">
                        <PawLogo className="mr-1 " />
                        <p className="text-3xl lg:text-3xl font-georgia">Calderon Bulldogs</p>
                    </h2>
                    <div className="flex space-x-4 mb-5 md:flex-col lg:flex-row">
                        <p className="mt-2 text-lg">Find us on social media:</p>
                        <div className=" flex items-center md:justify-center">
                        <a href="https://www.instagram.com/calderon_bulldogs/" aria-label="TikTok" className="text-blue_darker hover:text-blue_primary m-2">
                           <InstaLogo classname = "mx-2"/>
                           </a>
                            <a href="https://www.tiktok.com/@calderonbulldogs" aria-label="TikTok" className="text-blue_darker hover:text-blue_primary m-2">
                               <TiktokLogo classname=""/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:justify-around md:flex-row md:items-center sm:gap-x-16 lg:w-9/12">
                    {/* Navigation Links */}
                    <div className="flex justify-around mt-7">
                        <div>
                            <h3 className="font-bold my-4 text-xl">Explore</h3>
                            <ul className="space-y-4 text-lg">
                                <li><a href="#home" className="hover:text-blue_dark">Home</a></li>
                                <li><a href="#available_puppies" className="hover:text-blue_dark">Available Puppies</a></li>
                                <li><a href="#stud_service" className="hover:text-blue_dark">Stud Service</a></li>
                            </ul>
                        </div>
                         <div>
                            <ul className="space-y-2 mt-14 ml-10 text-lg leading-loose flex flex-col md:block">
                                <li><a href="#faq" className="hover:text-blue_dark">FAQ</a></li>
                                <li><a href="#contact" className="hover:text-blue_dark">Contact Us</a></li>
                               
                            </ul>
                        </div> 
                    </div>

                    {/* Contact Information */}
                    <div className="flex justify-around mt-10">
                        <div className="flex justify-around">
                        
                        <ul className="space-y-4 text-lg">
                            <h3 className="font-bold my-4 text-xl">Contact</h3>
                            <li className="flex items-center">
                               <PhoneIcon/>
                                <a href="tel:+11234567890" className="hover:text-blue_dark underline ml-1.5"> +1 (714) 232 9787</a>
                            </li>
                            <li className="flex items-center">
                                <MailIcon/>
                                <a href="mailto:calderonbulldogs@gmail.com" className="hover:text-blue_dark underline ml-1.5">
                                    calderonbulldogs@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <LocationIcon/>
                                <span className="leading-4 ml-1.5"> Orange County, CA</span>
                            </li>
                        </ul>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}