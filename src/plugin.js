import {AppContainer} from './AppContainer';

export function vueModelXPlugin(Vue,
  {
    appContainer,
    state,
    injectProperty = '$app'
  } = {}
) {
  if (!appContainer) {
    appContainer = new AppContainer(state);
  }

  Vue.mixin({

    beforeCreate() {
      const {stores} = this.$options;

      if (stores) {
        this[injectProperty] = appContainer;

        for (const propName of Object.keys(stores)) {
          this[propName] = appContainer.getStore(stores[propName]);
        }
      }
    }

  });
}
