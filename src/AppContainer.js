import {storeMeta} from './storeDecorator';

export class AppContainer {
  constructor(state) {
    this.stores = Object.create(null);
    this.state = state || {};
  }

  getStore(StoreConstructor) {
    const meta = StoreConstructor[storeMeta];

    if (!meta) {
      throw new Error(
        `VueModelX: couldn't find store meta information for "${StoreConstructor.name}" class.\n` +
        'Did you forget to decorate it with `@store`?'
      );
    }

    let {name, deps} = meta;
    let store = this.stores[name];

    if (store) {
      return store;
    }

    store = new StoreConstructor();
    this.stores[name] = store;

    if (deps) {
      if (typeof deps === 'function') {
        deps = deps();
      }

      for (const propName of Object.keys(deps)) {
        store[propName] = this.getStore(deps[propName]);
      }
    }

    const state = this.state.hasOwnProperty(name) ? this.state[name] : undefined;

    if (store.init) {
      store.init(state);
    } else if (state) {
      throw new Error(
        `VueModelX: there is a serialized state for "${meta.name}" store but it doesn't implement "init" method`
      );
    }

    return store;
  }
}
