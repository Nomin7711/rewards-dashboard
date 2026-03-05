/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          teal: '#30cfd0',
          purple: '#330867',
        },
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(to right, #30cfd0, #330867)',
        'theme-gradient-h': 'linear-gradient(90deg, #30cfd0, #330867)',
      },
    },
  },
  plugins: [],
};
