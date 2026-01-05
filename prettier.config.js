/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [
    'prettier-plugin-tailwindcss', // MUST come last
  ],

  // Start prettier-plugin-tailwindcss
  tailwindFunctions: ['cva'],
  // End prettier-plugin-tailwindcss
}

export default config
