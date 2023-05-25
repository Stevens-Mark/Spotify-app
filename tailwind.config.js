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
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    colors: {
      'pink-swan': '#B3B3B3',
      'gray-seven': '#121212',
      'textsubdued':'#a7a7a7',
      'highlight': 'hsla(0,0%,100%,.07)'
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
    'xs': '525px',
    'xxs': '375px',
    ..._screens,
  },
};
export const plugins = [
  require('tailwind-scrollbar-hide'),
  require("tailwindcss-animation-delay"),
  require('@tailwindcss/line-clamp'),
];
