import {AppContainer, store, Store} from '../src';

describe('AppContainer', () => {
  let FooStore;
  let BarStore;
  let BazStore;

  beforeEach(() => {
    FooStore =
      @store({
        name: 'foo',
        deps: () => ({
          /* eslint no-use-before-define: "off" */
          bar: BarStore,
          baz: BazStore
        })
      })
      class FooStore extends Store {};

    BarStore =
      @store({
        name: 'bar'
      })
      class BarStore extends Store {
        init(state) {
          Object.assign(this, state);
        }
      };

    BazStore =
      @store({
        name: 'baz',
        deps: {
          foo: FooStore,
          bar: BarStore
        }
      })
      class BarStore extends Store {};
  });

  describe('#getStore', () => {
    it("should throw if store class doesn't contain metadata", () => {
      class InvalidStore {}
      const app = new AppContainer();
      expect(() => app.getStore(InvalidStore)).toThrowErrorMatchingSnapshot();
    });

    it('should return store instance', () => {
      const app = new AppContainer();
      const fooStore = app.getStore(FooStore);
      expect(fooStore).toBeInstanceOf(FooStore);
    });

    it('should return the same store instance across multiple calls', () => {
      const app = new AppContainer();
      const fooStore = app.getStore(FooStore);
      expect(fooStore).toBeInstanceOf(FooStore);
      expect(app.getStore(FooStore)).toBe(fooStore);
    });

    it('should call `Store#init` method with initial store state', () => {
      FooStore.prototype.init = jest.fn();
      const state = {
        foo: {
          param: 'value'
        }
      };
      const app = new AppContainer(state);
      const fooStore = app.getStore(FooStore);
      expect(fooStore.init).toBeCalledWith(state.foo);
    });

    it("should throw if there is a store state but store doesn't implement `init` method", () => {
      const state = {
        foo: {
          param: 'value'
        }
      };
      const app = new AppContainer(state);
      expect(() => app.getStore(FooStore)).toThrowErrorMatchingSnapshot();
    });

    it('should inject dependent stores', () => {
      const state = {
        bar: {
          barParam: 'bar'
        }
      };
      const app = new AppContainer(state);
      const fooStore = app.getStore(FooStore);
      expect(fooStore.bar).toBeInstanceOf(BarStore);
      expect(fooStore.baz).toBeInstanceOf(BazStore);
      expect(fooStore.baz.foo).toBe(fooStore);
      expect(fooStore.baz.bar).toBeInstanceOf(BarStore);
      const barStore = app.getStore(BarStore);
      const bazStore = app.getStore(BazStore);
      expect(fooStore.bar).toBe(barStore);
      expect(fooStore.baz).toBe(bazStore);
      expect(fooStore.baz.bar).toBe(barStore);
      expect(barStore).toMatchObject(state.bar);
    });
  });
});
