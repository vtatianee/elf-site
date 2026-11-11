import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    '.next/**',
    'out/**',
    'next-env.d.ts',
    // Generated on every build (JPEG copies for link previews).
    'public/social/**',
    // Design tooling and source material — not part of the site's code.
    'design/**',
    'docs/**',
  ]),

  {
    rules: {
      // Static export without an image server: a plain <img> with fixed
      // width/height is the intended way (see IllustrationImage.tsx).
      '@next/next/no-img-element': 'off',

      // `const { internal: _internal, ...rest } = value` is how internal
      // fields are dropped; names starting with "_" are unused on purpose.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],

      // The idea data has internal fields that must never reach a page.
      // Only src/lib/ideas.ts may read the JSON file; everything else uses
      // its getters.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/data/ideas.json'],
              message:
                'Import ideas through "@/lib/ideas" — it strips the internal fields (editorNotes, illustrationBrief).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/lib/ideas.ts', 'scripts/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
])

export default eslintConfig
