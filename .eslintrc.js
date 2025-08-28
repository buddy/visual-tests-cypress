module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:unicorn/recommended",
    "plugin:cypress/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "cypress"],
  ignorePatterns: [
    "node_modules/",
    ".eslintrc.js",
    "README.md",
    "pnpm-lock.yaml",
    "LICENSE",
  ],
};
