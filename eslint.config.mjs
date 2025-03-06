// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';


export default tseslint.config(
    {
        settings: {
            "import/resolver": { "typescript": { "alwaysTryTypes": true } }
        },
        ignores: [
            'node_modules',
            '**/node_modules/**',
            '**/*.js',
            '**/*.d.ts',
            'dist/*',
            'coverage/**',
            '**/logs/**',
            'prod/**',
            '.husky/**',
            '.git/**',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    importPlugin.flatConfigs.recommended,
    // eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'module',
            parserOptions: {
                project: ['tsconfig.json', 'tsconfig.spec.json'],
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            'no-case-declarations': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    "checksVoidReturn": false,
                    "checksConditionals": false
                }
            ],
            "@typescript-eslint/require-await": "off",
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/only-throw-error': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            'import/newline-after-import':  ['error', { 'count': 2 } ],
            'import/order': [
                'error', {
                    groups: [
                        ['builtin', 'external']
                    ],
                    'newlines-between': 'always'
                }
            ]
        },
    },
);
