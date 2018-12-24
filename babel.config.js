module.exports = config;

config.presetEnvConfig = {
  modules: 'commonjs',
  targets: {
    ie: 11
  },
  useBuiltIns: false,
  loose: true
};

function config(api) {
  // Cache the returned value forever and don't call this function again.
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', config.presetEnvConfig]
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
};
