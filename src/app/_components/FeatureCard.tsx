import React from "react";

type FeatureCardProps = {
	imageSrc: string;
	imageAlt?: string;
	text: React.ReactNode;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
	imageSrc,
	imageAlt = "",
	text,
}) => {
	return(
		<div className='bg-[#f2f7ff] border-2 border-[#86B0FA]/40 rounded-2xl lg:mx-0 py-6 w-full h-full flex flex-col items-center justify-center' style={{ boxShadow: '0 4px 8px -2px rgba(134, 176, 250, 0.3)' }}>
			<img src={imageSrc} alt={imageAlt} className='mx-auto mb-4 w-16 h-16 md:w-20 md:h-20 object-contain'/>
			<h3 className="font-semibold text-md tracking-wide px-2">{text}</h3>
		</div>
        
	);
};

export default FeatureCard