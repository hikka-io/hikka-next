/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './layout/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                display: ['var(--font-fixel-display)'],
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        // base: false,
        themes: [
            {
                dark: {
                    "--btn-focus-scale": "1",
                    primary: '#000',
                    'primary-content': '#fff',
                    secondary: '#292929',
                    'secondary-content': '#fff',
                    accent: '#e779c1',
                    'accent-content': '#000',
                    neutral: '#c7c7c7',
                    'base-100': '#000',
                    'base-content': '#fff',
                    'error-content': '#000',
                },
                light: {
                    "--btn-focus-scale": "1",
                    primary: '#fff',
                    'primary-content': '#000',
                    secondary: '#eaeaea',
                    'secondary-content': '#000',
                    accent: '#e779c1',
                    'accent-content': '#000',
                    neutral: '#494949',
                    'base-100': '#fafafa',
                    'base-content': '#000',
                    'error-content': '#000',
                },
            },
        ],
    },
};
