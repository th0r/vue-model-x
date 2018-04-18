import {AppContainer} from './AppContainer';

export function vueModelXPlugin(Vue, opts = {}) {
  let {appContainer} = opts;
  const appContainerProp = opts.injectProperty || '$app';

  if (!appContainer) {
    appContainer = new AppContainer(opts.state);
  }

  Vue.mixin({

    beforeCreate() {
      const {stores} = this.$options;

      this[appContainerProp] = appContainer;

      if (stores) {
        for (const propName of Object.keys(stores)) {
          this[propName] = appContainer.getStore(stores[propName]);
        }
      }
    }

  });
}
