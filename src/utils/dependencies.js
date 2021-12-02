/**
 * @class
 * This class provides the external dependencies necessary for the operation
 * of the application.
 */
class Dependencies {
  // Constructor
  constructor() {
    this._dependencies = {
      userInfo: {},
      util: {},
    };

    let depEvt = (evt) => {
      evt.preventDefault();
      if (evt.detail.dependencies) this.update(evt.detail.dependencies);
    };
    document.addEventListener('vappDependencies', depEvt);
    document.dispatchEvent(new CustomEvent('getVappDeps'));
  }

  /**
   * Require a dependency by the id
   * @param {string} id - Id of the dependency
   */
  require(id) {
    return this._dependencies[id];
  }

  /**
   * Update dependencies
   * @param {object} dependencies - Dependencies object
   */
  update(dependencies) {
    if (dependencies) {
      this._dependencies.userInfo = dependencies.userInfo;
      this._dependencies.util = dependencies.widgets.util;
    }
  }
}

// Singleton
export default new Dependencies();
