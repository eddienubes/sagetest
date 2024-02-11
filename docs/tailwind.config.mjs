import starlightPlugin from '@astrojs/starlight-tailwind';

const accent = { 200: '#7ddbd9', 600: '#007c7a', 900: '#003b3a', 950: '#002a2a' };
const gray = {
  100: '#f5f6f8',
  200: '#eceef2',
  300: '#c0c2c7',
  400: '#888b96',
  500: '#545861',
  700: '#353841',
  800: '#24272f',
  900: '#17181c'
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [starlightPlugin()],
  theme: {
    extend: {
      colors: { accent, gray }
    }
  }
};

