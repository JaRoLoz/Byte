import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";


/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "import": pluginImport
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "import/no-internal-modules": [
                "error",
                {
                    "forbid": [
                        // shared
                        "*/shared/classes",
                        "*/shared/consts",
                        "*/shared/interfaces",
                        "*/shared/types",
                        "*/shared/db",
                        "*/shared/utils",
                        // client
                        "*/classes",
                        "*/game",
                        "*/playerPed",
                        "*/events",
                        // server
                        "*/classes",
                        "*/controllers",
                        "*/database",
                    ]
                }
            ]
        }
    }
];