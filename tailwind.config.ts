
import type { Config } from "tailwindcss";

export default {
	darkMode: ['class'],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Color palette
				pink: {
					50: '#FDF2F8',
					200: '#FBCFE8',
					400: '#F472B6',
					500: '#EC4899',
					600: '#DB2777',
				},
				rose: {
					50: '#FFF1F2',
				},
				blue: {
					500: '#3B82F6',
				},
				gray: {
					50: '#F9FAFB',
					200: '#E5E7EB',
					500: '#6B7280',
					700: '#374151',
					800: '#1F2937',
					900: '#111827',
				},
				softpink: {
					'50': '#fff5f8',
					'100': '#ffdfea',
					'200': '#ffc5d8',
					'300': '#ff9cbc',
					'400': '#ff6398',
					'500': '#ff3a7a',
					'600': '#ff1965',
					'700': '#e70051',
					'800': '#c70045',
					'900': '#a5033c',
					'950': '#5e001f',
				},
				indigo: {
					500: '#6366F1',
				},
				red: {
					500: '#EF4444',
				},
				// QSkyn dark mode custom colors
				qskyn: {
					// Brand colors
					primary: '#EC4C9E',
					primaryHover: '#FF73B5',
					secondary: '#B380F1',
					highlight: '#FF99CC',
					
					// Dark mode specific
					darkBackground: '#1E1B2E',
					darkCard: '#2C253A',
					darkInput: '#302A43',
					darkBorder: '#4B4363',
					
					// Text colors
					darkHeading: '#F2ECF9',
					darkText: '#C3BFD4',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'logo-spin': {
					from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'logo-spin': 'logo-spin infinite 20s linear'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'qskin-soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'qskin-dark': '0 4px 12px rgba(0, 0, 0, 0.2)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
