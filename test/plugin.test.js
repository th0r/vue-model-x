import {createLocalVue, mount} from '@vue/test-utils';
import VuePlugin, {AppContainer, observable, store, Store} from '../src';

describe('Vue plugin', function () {
  let Vue;
  let FooStore;
  let TestComponent;
  let comp;

  beforeEach(() => {
    Vue = createLocalVue();

    FooStore =
      @store({name: 'foo'})
      class FooStore extends Store {
        @observable bar = 1;
        @observable baz;

        init(state = {}) {
          this.baz = state.baz;
        }
      };

    TestComponent = {
      template: `
        <div>{{ fooStore.bar }}</div>
      `,

      stores: {
        fooStore: FooStore
      }
    };
  });

  it('should inject stores into component', function () {
    Vue.use(VuePlugin);
    mountComponent();
    expect(comp.text()).toEqual('1');
  });

  it("should not throw if component doesn't declare `stores` property", function () {
    Vue.use(VuePlugin);
    delete TestComponent.stores;
    TestComponent.template = '<div></div>';
    expect(() => mountComponent()).not.toThrow();
  });

  it("stores should be available in component's initialization hooks", function () {
    Vue.use(VuePlugin);
    TestComponent = {
      ...TestComponent,
      template: `
        <div>{{ prop }}</div>
      `,

      created() {
        expect(this.fooStore).toBeInstanceOf(FooStore);
      },

      data() {
        return {
          prop: this.fooStore.bar + 1
        };
      }
    };
    mountComponent();
    expect(comp.text()).toEqual('2');
  });

  it('should inject application container into `vm.$app` property', function () {
    Vue.use(VuePlugin);
    mountComponent();
    expect(comp.vm.$app).toBeInstanceOf(AppContainer);
  });

  it("should inject application container into `vm.$app` property if component doesn't declare `stores`", function () {
    Vue.use(VuePlugin);
    delete TestComponent.stores;
    TestComponent.template = '<div></div>';
    mountComponent();
    expect(comp.vm.$app).not.toBeDefined();
  });

  it('component should react to changes in stores', function () {
    Vue.use(VuePlugin);
    mountComponent();
    expect(comp.text()).toEqual('1');
    comp.vm.$app.stores.foo.bar = 2;
    expect(comp.text()).toEqual('2');
  });

  describe('options', function () {
    describe('appContainer', function () {
      it('should use provided application container', function () {
        const app = new AppContainer();
        Vue.use(VuePlugin, {
          appContainer: app
        });
        mountComponent();
        expect(comp.vm.$app).toBe(app);
      });
    });

    describe('state', function () {
      it('should use provided state', function () {
        Vue.use(VuePlugin, {
          state: {
            foo: {
              baz: 2
            }
          }
        });
        mountComponent();
        expect(comp.vm.$app.stores.foo.baz).toBe(2);
      });
    });

    describe('injectProperty', function () {
      it('should inject application container into provided property', function () {
        Vue.use(VuePlugin, {
          injectProperty: '$custom'
        });
        mountComponent();
        expect(comp.vm.$custom).toBeInstanceOf(AppContainer);
      });
    });

    it('should ignore `state` option if `appContainer` was passed', function () {
      const app = new AppContainer({
        foo: {
          baz: 2
        }
      });
      Vue.use(VuePlugin, {
        appContainer: app,
        state: {
          foo: {
            baz: 3
          }
        }
      });
      mountComponent();
      expect(comp.vm.$app.stores.foo.baz).toBe(2);
    });
  });

  function mountComponent() {
    comp = mount(TestComponent, {localVue: Vue});
  }
});
