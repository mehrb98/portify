module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:json/recommended",  
    "plugin:json/prettier"      
  ],
  plugins: ["@typescript-eslint", "json"], 
  rules: {
    semi: ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  overrides: [
    {
      files: ["*.json"],
      parser: "json-eslint-parser",
      rules: {
        "json/sort-keys": ["error", "asc", { ignoreComputedKeys: true }],
      },
    },
    {
      files: ["*.jsonc"],
      parser: "jsonc-eslint-parser",
      rules: {
        "jsonc/sort-keys": ["error", "asc", { ignoreComputedKeys: true }],
      },
    }
  ]
};
