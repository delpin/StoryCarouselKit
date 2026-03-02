import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '*.config.js', '*.config.ts']),

  // Base configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // React specific configuration
  {
    files: ['packages/react/**/*.{ts,tsx}', 'landing/**/*.{ts,tsx}'],
    rules: {
      // React specific rules can be added here if needed
    },
  },

  // Angular specific configuration
  {
    files: ['packages/angular/**/*.{ts,tsx}'],
    rules: {
      // Angular specific rules can be added here if needed
    },
  },

  // Vue specific configuration
  {
    files: ['packages/vue/**/*.{ts,tsx}'],
    rules: {
      // Vue specific rules can be added here if needed
    },
  },

  // Svelte specific configuration
  {
    files: ['packages/svelte/**/*.{ts,tsx}'],
    rules: {
      // Svelte specific rules can be added here if needed
    },
  },
])