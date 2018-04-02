import {Dep, Watcher} from './vue-internals';

const computedWatchers = Symbol('computedWatchers');
const noop = () => {};

export function computed(prototype, getterName, descriptor) {
  const getter = descriptor.get;

  if (!getter) {
    throw new TypeError(
      `${prototype.constructor.name}#${getterName} is not a getter so it can't be used as computed property`
    );
  }

  return {
    configurable: true,
    enumerable: true,
    get() {
      if (!Dep.target) {
        return getter.call(this);
      }

      if (!this.hasOwnProperty(computedWatchers)) {
        // Needed by Vue's `Watcher` constructor
        this._watchers = [];
        this[computedWatchers] = new Map();
      }

      if (!this[computedWatchers].has(prototype)) {
        this[computedWatchers].set(prototype, Object.create(null));
      }

      const watchers = this[computedWatchers].get(prototype);
      let watcher = watchers[getterName];

      if (!watcher) {
        // Lazily creating computed watcher
        watcher = watchers[getterName] = new Watcher(this, getter, noop, {lazy: true});
      }

      if (watcher.dirty) {
        watcher.evaluate();
      }

      watcher.depend();

      return watcher.value;
    }
  };
}
