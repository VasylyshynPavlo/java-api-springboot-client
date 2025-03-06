const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
    },
    extend: {
      animation: {
        shake: 'shake 0.5s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '50%': { transform: 'translateX(2px) rotate(1deg)' },
          '75%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [
    // ...
    flowbite.plugin(),
  ],
}

