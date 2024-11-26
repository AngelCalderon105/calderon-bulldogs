import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		screens: {
  			'custom-range-368-767': {
  				min: '368px',
  				max: '767px'
  			},
  			'custom-range-343-367': {
  				min: '343px',
  				max: '367px'
  			},
  			'custom-range-300-307': {
  				min: '300px',
  				max: '307px'
  			}
  		},
  		fontFamily: {
  			sans: ["var(--font-geist-sans)", ...fontFamily.sans],

			montserrat: ["Montserrat", ...fontFamily.sans], 
			georgia: ['Georgia','serif'],
  		},
		lineHeight: {
			'montserrat': '1.33', // Adjust the line height as needed
		  },
		borderRadius: {

  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			'custom-18': '18px',
  			'custom-16': '16px',
  			'custom-14': '14px',
  			'custom-12': '12px',
  			'custom-24': '24px',
  			'custom-30': '30px'
  		},
  		colors: {
  			dark_blue: '#1E2D67',
  			light_blue: '#F2F7FF',
  			font_light_blue: '#4E76BB',
  			secondary_grey: '#49454F',
			dark_grey: '#1E1E1E',
  			background: 'hsl(var(--background))',
  			designred: '#D11243',
  			designblue: '#344EAD',
  			foreground: 'var(--foreground)',
  			secblue: 'var(--secondaryblue)',
  			buttonblue: 'var(--buttonblue)',
  			navColor: 'var(--navColor)',
  			bgblue: 'var(--backgroundBlue)',
			accordionText: '#4B5563', 
  			background: 'hsl(var(--background))',
			designred:'#D11243',

  			foreground: 'var(--foreground)',
			blue_dark: 'var(--color-blue-dark)',
			blue_darker: 'var(--color-blue-darker)',
			blue_darkest: 'var(--color-blue-darkest)',
			blue_primary: 'var(--color-blue-primary)',
			blue_pale: 'var(--color-blue-pale)',
			blue_soft: 'var(--color-blue-soft)',
			blue_pastel: 'var(--color-blue-pastel)',
			blue_light_md: 'var(--color-blue-lighter)',
			blue_light_lg: 'var(--color-blue-lightest)',

			gray_dark:'var(--color-gray-dark)',
			gray_muted: 'var(--color-gray-muted)',

			navColor: 'var(--navColor)',

			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;