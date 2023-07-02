/** @type {import('tailwindcss').Config} */
import { screens as _screens } from 'tailwindcss/defaultTheme';

export const content = [
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}',
];
export const theme = {
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    colors: {
      'pink-swan': '#B3B3B3',
      'background-base': '#121212',
      'gray-seven': '#121212',
      textsubdued: '#a7a7a7',
      highlight: 'hsla(0,0%,100%,.07)',
      gray: {
        900: '#181818',
      },
    },
    boxShadow: {
      '3xl': '5px 5px 5px black',
      image: '0 8px 24px rgba(0,0,0,.5)',
      image2: '0 4px 60px rgba(0,0,0,.5)',
      custom:
        'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
    },
    dropShadow: {
      text: '0 1.2px 1.2px rgba(0,0,0,0.8)',
    },
    keyframes: {
      equaliser: {
        '0%': { transform: 'scaleY(0)' },
        '10%': { transform: 'scaleY(.18)' },
        '20%': { transform: 'scaleY(.4)' },
        '30%': { transform: 'scaleY(.81)' },
        '50%': { transform: 'scaleY(1)' },
        '60%': { transform: 'scaleY(1)' },
        '70%': { transform: 'scaleY(.81)' },
        '80%': { transform: 'scaleY(.4)' },
        '90%': { transform: 'scaleY(.18)' },
        '100%': { transform: 'scaleY(0)' },
      },
    },
    animation: {
      equalise: 'equaliser 1s linear infinite',
    },
  },
  screens: {
    xxs: '375px',
    xs: '525px',
    isSm: '525px',
    isMd: '640px',
    isMdLg: '825px',
    mdlg: '900px',
    ..._screens,
  },
};
export const plugins = [
  require('tailwind-scrollbar-hide'),
  require('tailwindcss-animation-delay'),
];
