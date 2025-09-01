import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"pulse-scale": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.05)" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-in",
				"pulse-scale": "pulse-scale 2s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};

export default config;
