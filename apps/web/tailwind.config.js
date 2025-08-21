/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './src/features/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/app/**/*.{ts,tsx}',
        './src/utils/**/*.{ts,tsx}',
        './src/services/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		gridAutoColumns: {
    			scroll: 'minmax(var(--grid-min, 7rem), var(--grid-max, 1fr))'
    		},
    		gridTemplateColumns: {
    			scroll: 'repeat(auto-fill, minmax(var(--grid-min, 7rem), var(--grid-max, 1fr)))'
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-geist)'
    			],
    			display: [
    				'var(--font-geist)'
    			]
    		},
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
    			warning: {
    				DEFAULT: 'hsl(var(--warning))',
    				foreground: 'hsl(var(--warning-foreground))'
    			},
    			info: {
    				DEFAULT: 'hsl(var(--info))',
    				foreground: 'hsl(var(--info-foreground))'
    			},
    			success: {
    				DEFAULT: 'hsl(var(--success))',
    				foreground: 'hsl(var(--success-foreground))'
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
				// status colors
				ongoing: {
					DEFAULT: 'hsl(var(--ongoing-background))',
					foreground: 'hsl(var(--ongoing-foreground))',
					border: 'hsl(var(--ongoing-border))'
				},
				finished: {
					DEFAULT: 'hsl(var(--finished-background))',
					foreground: 'hsl(var(--finished-foreground))',
					border: 'hsl(var(--finished-border))'
				},
				announced: {
					DEFAULT: 'hsl(var(--announced-background))',
					foreground: 'hsl(var(--announced-foreground))',
					border: 'hsl(var(--announced-border))'
				},
				discontinued: {
					DEFAULT: 'hsl(var(--discontinued-background))',
					foreground: 'hsl(var(--discontinued-foreground))',
					border: 'hsl(var(--discontinued-border))'
				},
				paused: {
					DEFAULT: 'hsl(var(--paused-background))',
					foreground: 'hsl(var(--paused-foreground))',
					border: 'hsl(var(--paused-border))'
				},
				// read/watch status colors
				planned: {
					DEFAULT: 'hsl(var(--planned-background))',
					foreground: 'hsl(var(--planned-foreground))',
					border: 'hsl(var(--planned-border))'
				},
				completed: {
					DEFAULT: 'hsl(var(--completed-background))',
					foreground: 'hsl(var(--completed-foreground))',
					border: 'hsl(var(--completed-border))'
				},
				on_hold: {
					DEFAULT: 'hsl(var(--on-hold-background))',
					foreground: 'hsl(var(--on-hold-foreground))',
					border: 'hsl(var(--on-hold-border))'
				},
				dropped: {
					DEFAULT: 'hsl(var(--dropped-background))',
					foreground: 'hsl(var(--dropped-foreground))',
					border: 'hsl(var(--dropped-border))'
				},
				reading: {
					DEFAULT: 'hsl(var(--reading-background))',
					foreground: 'hsl(var(--reading-foreground))',
					border: 'hsl(var(--reading-border))'
				},
				watching: {
					DEFAULT: 'hsl(var(--watching-background))',
					foreground: 'hsl(var(--watching-foreground))',
					border: 'hsl(var(--watching-border))'
				}
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
                'collapsible-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-collapsible-content-height)' },
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: '0' },
                },
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-out',
                'collapsible-up': 'collapsible-up 0.2s ease-out',
    		}
    	}
    },
    plugins: [
        require('tailwindcss-animate'),
        require('tailwind-gradient-mask-image'),
    ],
	safelist: [
		// status colors
		'bg-ongoing',
		'bg-ongoing-foreground',
		'text-ongoing-foreground',
		'border-ongoing-border',
		'bg-finished',
		'bg-finished-foreground',
		'text-finished-foreground',
		'border-finished-border',
		'bg-announced',
		'bg-announced-foreground',
		'text-announced-foreground',
		'border-announced-border',
		'bg-discontinued',
		'bg-discontinued-foreground',
		'text-discontinued-foreground',
		'border-discontinued-border',
		'bg-paused',
		'bg-paused-foreground',
		'text-paused-foreground',
		'border-paused-border',
		// read/watch status colors
		'bg-planned',
		'bg-planned/80',
		'bg-planned-foreground',
		'text-planned-foreground',
		'text-planned',
		'border-planned-border',
		'bg-completed',
		'bg-completed/80',
		'bg-completed-foreground',
		'text-completed-foreground',
		'text-completed',
		'border-completed-border',
		'bg-on_hold',
		'bg-on_hold/80',
		'bg-on_hold-foreground',
		'text-on_hold-foreground',
		'text-on_hold',
		'border-on_hold-border',
		'bg-dropped',
		'bg-dropped/80',
		'bg-dropped-foreground',
		'text-dropped-foreground',
		'text-dropped',
		'border-dropped-border',
		'bg-reading',
		'bg-reading/80',
		'bg-reading-foreground',
		'text-reading-foreground',
		'text-reading',
		'border-reading-border',
		'bg-watching',
		'bg-watching/80',
		'bg-watching-foreground',
		'text-watching-foreground',
		'text-watching',
		'border-watching-border',
	],
};
