import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
	{
		plugins: {
			"@typescript-eslint": typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "script",
		},

		rules: {
			indent: ["error", "tab", {
				SwitchCase: 1,
			}],
			"linebreak-style": ["error", "windows"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-require-import": "off",
		},
	},
	{
		ignores: ["dist/*", "babel.config.js", "ecosystem.config.js", "build.js", "index.js", "migrate.ts"],
	},
	{
		files: ["src/**/*.ts"],
	},
];