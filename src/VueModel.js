import isFunction from 'lodash.isfunction';
import {Watcher} from './vue-internals';
import {defineWatchersProperty, markAsStatic} from './utils';

export class VueModel {

  constructor() {
    // Tells Vue that it doesn't need to convert all properties of this object to reactive because
    // we explicitly mark reactive properties with `@observable` and `@computed` decorators.
    // All other properties shouldn't be reactive.
    markAsStatic(this);
  }

  update(data) {
    Object.assign(this, data);
  }

  watch(expression, callback, options) {
    if (!this.hasOwnProperty('_watchers')) {
      defineWatchersProperty(this);
    }

    if (typeof callback === 'string') {
      const methodName = callback;

      callback = this[methodName];

      if (!isFunction(callback)) {
        throw new TypeError(`VueModel#watch: Model doesn't have "${methodName}" method`);
      }
    }

    const watcher = new Watcher(this, expression, callback, options);

    if (options && options.immediate) {
      callback.call(this, watcher.value);
    }

    return () => {
      watcher.teardown();
    };
  }

}
