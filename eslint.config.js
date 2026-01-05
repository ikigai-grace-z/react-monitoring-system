import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const prettierignorePath = fileURLToPath(
  new URL('.prettierignore', import.meta.url)
)

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(prettierignorePath),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      perfectionist: perfectionist,
    },
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      // https://github.com/un-ts/eslint-plugin-import-x/issues/421
      // @ts-ignore
      importX.flatConfigs.recommended,
      // @ts-ignore
      importX.flatConfigs.typescript,
      tanstackQuery.configs['flat/recommended'],
      reactHooks.configs.flat['recommended-latest'],
    ],
    languageOptions: {
      parser: ts.parser,
      globals: globals.browser,
      ecmaVersion: 2020,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver(),
        createNodeResolver(),
      ],
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'import-x/order': [
        'warn',
        {
          alphabetize: { order: 'asc' },
          pathGroups: [
            {
              pattern: '@/assets/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/shared/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/features/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
      // Perfectionist: 自動排序對象、數組、imports 等
      // 'perfectionist/sort-objects': [
      //   'warn',
      //   {
      //     type: 'alphabetical',
      //     order: 'asc',
      //   },
      // ],
      // 'perfectionist/sort-imports': [
      //   'warn',
      //   {
      //     type: 'alphabetical',
      //     order: 'asc',
      //   },
      // ],
      // 'perfectionist/sort-named-imports': [
      //   'warn',
      //   {
      //     type: 'alphabetical',
      //     order: 'asc',
      //   },
      // ],
    },
  },
  prettierRecommended,
])
