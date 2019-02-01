module.exports = config;

const minNodeVersion = Number(require('./package.json').engines.node.match(/\d+/)[0]);

Object.assign(config, {
  presetEnvConfig: {
    modules: false,
    useBuiltIns: false,
    loose: true
  },
  minNodeVersion
});

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
              node: minNodeVersion
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
