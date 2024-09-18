/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/page-sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "contact-section": "linear-gradient(to right bottom, rgb(0, 0, 0, 0.60), rgb(0, 0, 0, 0.60)),url(/contact-section.jpg)"
      },
      fontSize: {
        h1: [
          '88px',
          {
            lineHeight: '88px',
            fontWeight: '700',
          },
        ],
        h2: [
          '48px',
          {
            lineHeight: '56px',
            fontWeight: '700',
          },
        ],
        h3: [
          '24px',
          {
            lineHeight: '24px',
            fontWeight: '600',
          },
        ],
        h4: [
          '20px',
          {
            lineHeight: '28px',
            fontWeight: '600',
          },
        ],
        'sub-heading': [
          '1.5rem',
          {
            lineHeight: '2rem',
            fontWeight: '400',
          },
        ],
        body: [
          '16px',
          {
            lineHeight: '24px',
            fontWeight: '400',
            letterSpacing: '0.02em',
          },
        ],
        footnote: [
          '12px',
          {
            lineHeight: '20px',
            fontWeight: '400',
            letterSpacing: '0.02em',
          },
        ],
        button: [
          '16px',
          {
            lineHeight: '20px',
            fontWeight: '400',
          },
        ],
      },
      colors: {
        body: 'rgba(0,0,0,0.85)',
        primary: "#0E4459",
        secondary: "#2976A6",
        accent: '#73A9D9',
        "light-grey": "#687076",
        "sub-head": "#2e2e2e80",
        subtitle: "#00000073",
        grey: "rgba(0, 0, 0, 0.55)",
        white: "#ffffff",
      },
      borderRadius: {
        'inner-border-radius': 'calc(10px - 8px)',
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'homepage-contest-stat': 'max(40%, 300px) auto',
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'about-mission': 'auto 560px',
        'tab': '46px auto 46px',
      }
    },
  },
  plugins: [],
}