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
            {
              name: '@/components/ui/Icons',
              message: '아이콘은 @/components/ui/Icon 또는 @/components/ui를 사용하세요.',
            },
            {
              name: '@/components/common',
              message: '공용 컴포넌트는 @/components/ui 또는 @/components/feedback을 사용하세요.',
            },
            {
              name: '@/utils/format',
              message: '포맷 유틸은 @/lib/utils를 사용하세요.',
            },
          ],
          patterns: [
            {
              group: ['@/components/common/*'],
              message: '공용 컴포넌트는 @/components/ui 또는 @/components/feedback을 사용하세요.',
            },
          ],
        },
      ],
    },
  },
])
