module.exports = {
  printWidth: 120,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve'
      }
    }
  ]
};
