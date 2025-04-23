/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': {'min': '1536px'},
        '2xl': {'max': '1535px'},
        // => @media (max-width: 1535px) { ... }

        'xl': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }

        'lg': {'max': '1024px'},
        // => @media (max-width: 1023px) { ... }

        'md': {'max': '768px'},
        // => @media (max-width: 767px) { ... }

        'sm': {'max': '640px'},
        // => @media (max-width: 639px) { ... }
        'sl':{'max':'425px'},
        'smm':{'max':'372px'},
        'ss':{'max':'320px'},
        
      },
      backgroundColor:{
         brand_colors:"#0036c7",
         brand_color_2:"#161c31",
         brand_color_3:"#d86bcc",
         brand_color_4:"#2bbcde"
      },
      textColor:{
        brand_color:"#0036c7",
        brand_color_2:"#d86bcc"
      },
      borderColor:{
       b_color:"#DDDDDE",
       brand_b_color:"#0036c7"
      },
      fontFamily: {
        inter: ['Inter'],
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato']
      }
    },
  },
  plugins: [],
}