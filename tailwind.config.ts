import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
		screens: {
			'custom-range-368-767': { min: '368px', max: '767px' },
			'custom-range-343-367': { min: '343px', max: '367px' },
			'custom-range-300-307': { min: '300px', max: '307px' }, // Custom range for 476px to 767px
		},
  		fontFamily: {
			sans: ['Montserrat', 'sans-serif'],
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
			'custom-12': '12px',  // Custom font size with a key of 'custom-18' for 18px
			'custom-24': '24px',  // Example for 24px font size
			'custom-30': '30px',  // Example for 30px font size
			// Add more custom sizes as needed
		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'var(--foreground)',
			secblue: 'var(--secondaryblue)',
			buttonblue: 'var(--buttonblue)',
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
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;