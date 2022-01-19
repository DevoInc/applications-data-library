module.exports = {
  'bail': true,
  'verbose': true,
  'testRegex': './test/.*?.test.js$',
  'roots': [
    './',
    '<rootDir>/src/'
  ],
  'collectCoverage': true,
  'moduleNameMapper': {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  'transform': {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  globals: {
    'baseWeb': {
      'pageManager':{
        'currentPage': ''
      }
    },
    'moment': () => ({
      'valueOf':() => 1
    }),
    'moment.ts': () => 1,
    'lt': {
      'app': {
        'appId' : '123456'
      }
    }

  }
};
