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
		<div className='bg-[#f2f7ff] border-2 border-[#86B0FA]/40 rounded-lg md:mx-40 lg:mx-0 py-10'>
			<img src={imageSrc} alt={imageAlt} className='mx-auto mb-4'/>
			<h3 className="font-semibold text-md tracking-wide">{text}</h3>
		</div>
        
	);
};

export default FeatureCard