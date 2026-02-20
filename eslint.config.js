import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/common/Button',
              message: 'Button은 @/components/ui/Button 또는 @/components/ui를 사용하세요.',
            },
            {
              name: '@/components/common',
              importNames: ['Button'],
              message: 'Button은 @/components/ui/Button 또는 @/components/ui를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
])
