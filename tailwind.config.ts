import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "mint-green": "#80EE98",
        "tropical-teal": "#09D1C7",
        "sea-foam": "#46DFB1",
        "ocean-deep": "#15919B",
        "aqua-twilight": "#0C6478",
        "midnight-blue": "#213A58",
      },
      backgroundImage: {
        "custom-gradient": `linear-gradient(to bottom, var(--mint-green), var(--seafoam), var(--tropical-teal), var(--ocean-deep))`

      },

    },
  },
  plugins: [],
} satisfies Config;
