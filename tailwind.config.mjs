/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			primary: colors.zinc,
			dark_accent: colors.teal[200],
			light_accent: colors.blue,
			black: colors.black
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'selector'
}
