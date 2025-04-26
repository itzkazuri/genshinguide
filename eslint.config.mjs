import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      js,
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,

      // React specific overrides
      'react/react-in-jsx-scope': 'off', // Next.js tidak butuh import React
      'react/no-unknown-property': ['error', { ignore: ['jsx'] }], // Allow styled-jsx
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
]);
