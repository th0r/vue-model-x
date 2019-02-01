const {presetEnvConfig, minNodeVersion} = require('./babel.config');

module.exports = {
  extends: './babel.config.js',
  presets: [
    ['@babel/preset-env', {
      ...presetEnvConfig,
      modules: 'commonjs',
      targets: {
        node: minNodeVersion
      }
    }]
  ]
};
