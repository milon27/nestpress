import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-plugin-prettier"

export default [
    // Base JavaScript recommended rules
    js.configs.recommended,

    // JavaScript files
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                // Node.js globals
                Buffer: "readonly",
                console: "readonly",
                global: "readonly",
                process: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly",
                clearTimeout: "readonly",
                clearInterval: "readonly",
            },
        },
        plugins: {
            prettier,
            import: importPlugin,
        },
        rules: {
            // Prettier integration
            "prettier/prettier": [
                "warn",
                {
                    endOfLine: "auto",
                },
            ],
            "no-console": "warn",
            "no-underscore-dangle": "off",
            "no-restricted-syntax": "off",
            "no-plusplus": "off",
        },
    },

    // TypeScript files
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                // Node.js globals
                Buffer: "readonly",
                console: "readonly",
                global: "readonly",
                process: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly",
                clearTimeout: "readonly",
                clearInterval: "readonly",
                NodeJS: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            prettier,
            import: importPlugin,
        },
        rules: {
            // Prettier integration
            "prettier/prettier": [
                "warn",
                {
                    endOfLine: "auto",
                },
            ],

            // TypeScript specific rules
            ...typescript.configs.recommended.rules,

            // Console and debugging
            "no-console": "warn",

            // Style and formatting
            "linebreak-style": "off",
            "no-nested-ternary": "off",
            radix: "off",
            "no-underscore-dangle": "off",

            // Import rules
            "import/no-cycle": "warn",
            "import/prefer-default-export": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: [
                        "**/__test__/**",
                        "**/*.test.*",
                        "**/*.spec.*",
                        "**/test-*",
                        "**/vitest.config.*",
                        "**/eslint.config.*",
                        "**/drizzle.config.*",
                    ],
                },
            ],
            "no-restricted-syntax": "off",

            // Class and method rules
            "class-methods-use-this": "off",

            // TypeScript specific overrides
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-explicit-any": "warn",

            // Async/await rules
            "require-await": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "no-await-in-loop": "off",

            // Loop rules
            "no-plusplus": "off",

            // Variable rules
            "no-unused-vars": "off", // Turn off base rule
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-redeclare": "off", // Turn off base rule
        },
    },

    // Test files specific configuration
    {
        files: ["**/__test__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
        rules: {
            // Relaxed rules for test files
            "no-console": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-plusplus": "off",
            "no-restricted-syntax": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },

    // Ignore patterns
    {
        ignores: [
            "node_modules/**",
            "resources/**",
            "dist/**",
            "drizzle.config.ts",
            "vitest.config.mjs",
            "public/**",
            "**/*.d.ts",
            ".eslintrc.js.old",
        ],
    },
]
