module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: 'commonjs',
      targets: {
        ie: 11
      },
      useBuiltIns: false,
      loose: true
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }]
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        ['@babel/plugin-proposal-class-properties', {loose: true}]
      ]
    }
  }
};
