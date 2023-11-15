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
            colors: {
                // 'dark-grey': 'rgba(110, 110, 110, 0.3)',
                // 'stone-900': 'rgba(41, 41, 41, 1)',
                // 'text-color': 'rgba(173, 173, 173, 1)',
            },
        },
    },
    plugins: [require('daisyui'), require('@headlessui/tailwindcss')],
    daisyui: {
        // base: false,
        themes: [
            {
                hikka: {
                    "--btn-focus-scale": "1",
                    primary: '#000',
                    'primary-content': '#fff',

                    secondary: '#292929',
                    'secondary=content': '#fff',

                    accent: '#e779c1',
                    'accent-content': '#000',

                    neutral: '#494949',
                    // 'base-content': '',

                    // accent: '#f3cc30',

                    // neutral: '#221551',

                    'base-100': '#000',
                    // "base-100": `rgba(22, 8, 32, 1), rgba(0, 0, 0, 1)`,

                    /*info: '#53c0f3',

                    success: '#71ead2',

                    warning: '#f3cc30',

                    error: '#e24056',*/
                },
            },
        ],
    },
};
