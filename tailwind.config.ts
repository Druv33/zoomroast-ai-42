import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					elevated: 'hsl(var(--surface-elevated))'
				},
				glass: {
					primary: 'hsl(var(--glass-primary))',
					secondary: 'hsl(var(--glass-secondary))',
					tertiary: 'hsl(var(--glass-tertiary))',
					border: 'hsl(var(--glass-border))',
					'border-strong': 'hsl(var(--glass-border-strong))',
					hover: 'hsl(var(--hover-glass))',
					active: 'hsl(var(--active-glass))'
				},
				neon: {
					primary: 'hsl(var(--neon-primary))',
					secondary: 'hsl(var(--neon-secondary))',
					tertiary: 'hsl(var(--neon-tertiary))',
					glow: 'hsl(var(--neon-glow))',
					'glow-strong': 'hsl(var(--neon-glow-strong))'
				},
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
				}
			},
			borderRadius: {
				'xl': 'var(--radius-xl)',
				'lg': 'var(--radius-lg)',
				'md': 'var(--radius)',
				'sm': 'var(--radius-sm)',
			},
			backdropBlur: {
				'sm': 'var(--blur-sm)',
				'md': 'var(--blur-md)', 
				'lg': 'var(--blur-lg)',
				'xl': 'var(--blur-xl)'
			},
			boxShadow: {
				'glass': 'var(--shadow-glass)',
				'neon': 'var(--shadow-neon)',
				'neon-strong': 'var(--shadow-neon-strong)'
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
				'bounce-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(60vh) scale(0.3)'
					},
					'50%': {
						opacity: '1',
						transform: 'translateY(-10px) scale(1.05)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(60vh)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'stagger-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.8)',
						filter: 'blur(4px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)',
						filter: 'blur(0)'
					}
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'logo-pulse': {
					'0%, 100%': { 
						transform: 'scale(1)',
						filter: 'drop-shadow(0 0 20px hsl(var(--neon-glow)))'
					},
					'50%': { 
						transform: 'scale(1.06)',
						filter: 'drop-shadow(0 0 40px hsl(var(--neon-glow-strong)))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.22, 0.9, 0.32, 1) forwards',
				'stagger-in': 'stagger-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'shimmer': 'shimmer 2s infinite',
				'logo-pulse': 'logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
