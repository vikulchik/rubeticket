// eslint.config.mjs
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import angular from '@angular-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/*.spec.ts', '**/*.test.ts', '**/test/**', '**/tests/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@angular-eslint': angular,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'warn',
      'no-undef': 'off',
    },
  },
];
