module.exports = function(api) {
  api.cache(true);
  const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
  process.env.BABEL_ENV = env;
  process.env.NODE_ENV = env;
  return {
    presets: [require.resolve('babel-preset-react-app')]
  };
};
