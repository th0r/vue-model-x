const commonConfig = require('./babel.config');
const presetEnvConfig = commonConfig.presets.find(preset => preset[0] === '@babel/preset-env')[1];

module.exports = {
  presets: [
    ['@babel/preset-env', {
      ...presetEnvConfig,
      modules: false
    }]
  ]
};
