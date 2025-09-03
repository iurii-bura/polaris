import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTs from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default pluginTs.config(
    pluginJs.configs.recommended,
    ...pluginTs.configs.strictTypeChecked,
    ...pluginTs.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        ignores: [
            '**/node_modules/',
            '**/dist/',
            '**/reports',
            '**/.DS_Store',
            '**/.vscode/',
            '**/.env',
            '**/npm-debug.log*',
            '**/crash.log',
            '**/crash.*.log'
        ]
    },

    // Application
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: 'detect',
                runtime: 'automatic'
            }
        },
        ...pluginReact.configs.flat.recommended,
        rules: {
            // TypeScript
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-ignore': 'allow-with-description',
                    minimumDescriptionLength: 10
                }
            ],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: true
                }
            ],
            '@typescript-eslint/method-signature-style': ['error', 'method'],
            '@typescript-eslint/no-confusing-non-null-assertion': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowString: false,
                    allowNumber: false,
                    allowNullableObject: false,
                    allowNullableBoolean: false,
                    allowNullableString: false,
                    allowNullableNumber: false,
                    allowAny: false,
                    allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false
                }
            ],

            // React
            'react/boolean-prop-naming': 'off',
            'react/button-has-type': [
                'error',
                {
                    button: true,
                    submit: true,
                    reset: true
                }
            ],
            'react/checked-requires-onchange-or-readonly': [
                'error',
                {
                    ignoreMissingProperties: false,
                    ignoreExclusiveCheckedAttribute: false
                }
            ],
            'react/default-props-match-prop-types': 'off',
            'react/destructuring-assignment': [
                'error',
                'always',
                {
                    ignoreClassFields: false,
                    destructureInSignature: 'always'
                }
            ],
            'react/display-name': 'error',
            'react/forbid-component-props': 'off',
            'react/forbid-dom-props': 'off',
            'react/forbid-elements': 'off',
            'react/forbid-foreign-prop-types': 'error',
            'react/forbid-prop-types': 'off',
            'react/function-component-definition': [
                'error',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function'
                }
            ],
            'react/hook-use-state': [
                'error',
                {
                    allowDestructuredState: true
                }
            ],
            'react/iframe-missing-sandbox': 'error',
            'react/jsx-boolean-value': ['error', 'always'],
            'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
            'react/jsx-closing-tag-location': ['error', 'tag-aligned'],
            'react/jsx-curly-newline': ['error', 'consistent'],
            'react/jsx-curly-spacing': ['error', 'never'],
            'react/jsx-equals-spacing': ['error', 'never'],
            'react/jsx-filename-extension': [
                'error',
                {
                    allow: 'as-needed',
                    extensions: ['.tsx']
                }
            ],
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'react/jsx-fragments': ['error', 'syntax'],
            'react/jsx-handler-names': [
                'error',
                {
                    eventHandlerPrefix: 'handle',
                    eventHandlerPropPrefix: 'on',
                    checkLocalVariables: true,
                    checkInlineFunction: true,
                    ignoreComponentNames: []
                }
            ],
            'react/jsx-indent-props': 'off',
            'react/jsx-indent': 'off',
            'react/jsx-key': [
                'error',
                {
                    checkFragmentShorthand: true,
                    checkKeyMustBeforeSpread: true,
                    warnOnDuplicates: true
                }
            ],
            'react/jsx-max-depth': 'off',
            'react/jsx-max-props-per-line': [
                'error',
                {
                    maximum: 1,
                    when: 'multiline'
                }
            ],
            'react/jsx-newline': 'off',
            'react/jsx-no-bind': [
                'error',
                {
                    ignoreRefs: true,
                    allowArrowFunctions: false,
                    allowFunctions: false,
                    allowBind: false
                }
            ],
            'react/jsx-no-comment-textnodes': 'error',
            'react/jsx-no-constructed-context-values': 'error',
            'react/jsx-no-duplicate-props': [
                'error',
                {
                    ignoreCase: false
                }
            ],
            'react/jsx-no-leaked-render': [
                'error',
                {
                    validStrategies: ['ternary']
                }
            ],
            'react/jsx-no-literals': 'off',
            'react/jsx-no-script-url': 'error',
            'react/jsx-no-target-blank': [
                'error',
                {
                    allowReferrer: false,
                    enforceDynamicLinks: 'always',
                    warnOnSpreadAttributes: true,
                    links: true,
                    forms: false
                }
            ],
            'react/jsx-no-undef': 'off',
            'react/jsx-no-useless-fragment': [
                'error',
                {
                    allowExpressions: false
                }
            ],
            'react/jsx-one-expression-per-line': 'off',
            'react/jsx-pascal-case': 'error',
            'react/jsx-props-no-multi-spaces': 'error',
            'react/jsx-props-no-spreading': [
                'error',
                {
                    html: 'enforce',
                    custom: 'enforce',
                    explicitSpread: 'enforce',
                    exceptions: []
                }
            ],
            'react/jsx-sort-props': 'off',
            'react/jsx-tag-spacing': [
                'error',
                {
                    closingSlash: 'never',
                    beforeSelfClosing: 'always',
                    afterOpening: 'never',
                    beforeClosing: 'never'
                }
            ],
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/jsx-wrap-multilines': [
                'error',
                {
                    declaration: 'parens-new-line',
                    assignment: 'parens-new-line',
                    return: 'parens-new-line',
                    arrow: 'parens-new-line',
                    condition: 'parens-new-line',
                    logical: 'parens-new-line',
                    prop: 'parens-new-line'
                }
            ],
            'react/no-access-state-in-setstate': 'error',
            'react/no-adjacent-inline-elements': 'error',
            'react/no-array-index-key': 'error',
            'react/no-arrow-function-lifecycle': 'error',
            'react/no-children-prop': [
                'error',
                {
                    allowFunctions: false
                }
            ],
            'react/no-danger-with-children': 'error',
            'react/no-danger': [
                'error',
                {
                    customComponentNames: []
                }
            ],
            'react/no-deprecated': 'error',
            'react/no-did-mount-set-state': 'error',
            'react/no-did-update-set-state': ['error', 'disallow-in-func'],
            'react/no-direct-mutation-state': 'error',
            'react/no-find-dom-node': 'error',
            'react/no-invalid-html-attribute': 'error',
            'react/no-is-mounted': 'error',
            'react/no-render-return-value': 'error',
            'react/no-multi-comp': [
                'error',
                {
                    ignoreStateless: false
                }
            ],
            'react/no-namespace': 'error',
            'react/no-object-type-as-default-prop': 'error',
            'react/no-redundant-should-component-update': 'error',
            'react/no-set-state': 'off',
            'react/no-string-refs': [
                'error',
                {
                    noTemplateLiterals: true
                }
            ],
            'react/no-this-in-sfc': 'error',
            'react/no-typos': 'error',
            'react/no-unescaped-entities': 'error',
            'react/no-unknown-property': [
                'error',
                {
                    ignore: [],
                    requireDataLowercase: true
                }
            ],
            'react/no-unsafe': [
                'error',
                {
                    checkAliases: true
                }
            ],
            'react/no-unstable-nested-components': [
                'error',
                {
                    allowAsProps: false,
                    customValidators: []
                }
            ],
            'react/no-unused-class-component-methods': 'error',
            'react/no-unused-prop-types': [
                'error',
                {
                    ignore: [],
                    customValidators: [],
                    skipShapeProps: true
                }
            ],
            'react/no-unused-state': 'error',
            'react/no-will-update-set-state': ['error', 'disallow-in-func'],
            'react/prefer-es6-class': ['error', 'always'],
            'react/prefer-exact-props': 'error',
            'react/prefer-read-only-props': 'error',
            'react/prefer-stateless-function': [
                'error',
                {
                    ignorePureComponents: true
                }
            ],
            'react/prop-types': [
                'error',
                {
                    ignore: [],
                    customValidators: [],
                    skipUndeclared: false
                }
            ],
            'react/react-in-jsx-scope': 'off',
            'react/require-default-props': 'off',
            'react/require-optimization': 'off',
            'react/require-render-return': 'error',
            'react/self-closing-comp': 'error',
            'react/sort-comp': 'off',
            'react/sort-default-props': 'off',
            'react/sort-prop-types': 'off',
            'react/state-in-constructor': ['error', 'never'],
            'react/static-property-placement': ['error', 'static public field'],
            'react/style-prop-object': [
                'error',
                {
                    allow: []
                }
            ],
            'react/void-dom-elements-no-children': 'error'
        }
    },

    // Configurations files
    {
        files: ['**/*.config.js'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        ...pluginTs.configs.disableTypeChecked
    },
    {
        files: ['**/*.config.ts'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
);
