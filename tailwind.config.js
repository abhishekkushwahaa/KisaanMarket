/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        default: ['BeVietnamPro', 'sans-serif'],
        bold: ['BeVietnamProBold', 'sans-serif'],
        medium: ['BeVietnamProMedium', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
