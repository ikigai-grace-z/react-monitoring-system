/** @type {import('lint-staged').Configuration} */
export default {
  '*': 'pnpm format',
  '*.{ts,tsx}': ['pnpm lint:fix', 'bash -c "pnpm type-check"'],
}
