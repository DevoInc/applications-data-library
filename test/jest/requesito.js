const base = {
  'lt-web/base/UserMetadata.js': {
    _metadata: {
      locale: 'en_US'
    }
  }
};

export default {

  require(path) {
    return base[path];
  }

};