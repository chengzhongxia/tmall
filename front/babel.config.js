module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    "@babel/typescript"
  ],
  "overrides": [
    {
      "test": /\.vue$/,
      "plugins": ["@babel/transform-typescript"]
    }
  ]
}
