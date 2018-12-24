const {presetEnvConfig} = require('./babel.config');

module.exports = {
  extends: './babel.config.js',
  presets: [
    ['@babel/preset-env', {
      ...presetEnvConfig,
      modules: false
    }]
  ]
};
