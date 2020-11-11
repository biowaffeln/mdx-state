module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
		defaultLineHeights: true,
		standardFontWeights: true,
	},
	experimental: {
		extendedSpacingScale: true,
	},
	purge: [
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {},
	variants: {},
	plugins: [require("@tailwindcss/typography")],
};
