import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            // Beagle Design System Colors
            colors: {
                cream: '#F9F5F0',
                'light-beige': '#F2EAD3',
                'forest-green': '#344F1F',
                'dark-green': '#2a3f19',
                orange: '#F4991A',
                'warm-orange': '#FA812F',
                'medium-text': '#5a6c4a',
            },
            // Large Organic Border Radius
            borderRadius: {
                'beagle-sm': '15px',
                'beagle-md': '20px',
                'beagle-lg': '25px',
                'beagle-xl': '30px',
            },
            // Soft Shadows
            boxShadow: {
                'beagle-sm': '0 2px 20px rgba(52, 79, 31, 0.05)',
                'beagle-md': '0 10px 30px rgba(52, 79, 31, 0.1)',
                'beagle-lg': '0 20px 60px rgba(52, 79, 31, 0.1)',
                'beagle-xl': '0 20px 60px rgba(52, 79, 31, 0.15)',
                'orange': '0 4px 15px rgba(244, 153, 26, 0.3)',
                'orange-lg': '0 15px 40px rgba(250, 129, 47, 0.4)',
            },
            // Typography
            fontSize: {
                'hero': '4rem',
                'h1': '2.8rem',
                'h2': '2.5rem',
                'h3': '2rem',
                'h4': '1.8rem',
            },
            fontWeight: {
                'extrabold': '800',
                'black': '900',
            },
            // Spacing for consistent layouts
            spacing: {
                'section-sm': '4rem',
                'section-md': '6rem',
                'section-lg': '8rem',
            },
            // Container
            maxWidth: {
                'beagle': '1400px',
            },
            // Backdrop Blur for glassmorphism
            backdropBlur: {
                'beagle': '10px',
            },
        },
    },
    plugins: [typography],
} satisfies Config;