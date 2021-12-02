module.exports = function (api) {
  api.cache(true)
  const presets = ['@babel/env'];
  const plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties'
  ];
  return {
    presets,
    plugins
  };
}
