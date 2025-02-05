const baseConfig = require("../../eslint.config.cjs");

module.exports = [
    ...baseConfig,
    {
      "files": [
        "**/*.json"
      ],
      "rules": {
        "@nx/dependency-checks": [
          "error",
          {
            "ignoredFiles": [
              "{projectRoot}/eslint.config.{js,cjs,mjs}",
              "{projectRoot}/rollup.config.{js,ts,mjs,mts,cjs,cts}"
            ]
          }
        ]
      },
      "languageOptions": {
        "parser": require('jsonc-eslint-parser')
      }
    }
];
