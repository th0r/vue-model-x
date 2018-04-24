import {Store, store} from '../src';
import {storeMeta} from '../src/storeDecorator';

describe('@store', () => {
  it('should throw an error if decorator is called without options', () => {
    function createStore() {
      return @store()
      class FooStore extends Store {};
    }

    expect(createStore).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if decorator options don't provide store name", () => {
    function createStore() {
      return @store({deps: {}})
      class FooStore extends Store {};
    }

    expect(createStore).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if class doesn't extend `Store`", () => {
    function createStore() {
      return @store({name: 'Foo'})
      class FooStore {};
    }

    expect(createStore).toThrowErrorMatchingSnapshot();
  });

  it('should attach metadata to store class', () => {
    const meta = {
      name: 'Store'
    };

    @store(meta)
    class FooStore extends Store {};

    expect(FooStore[storeMeta]).toEqual(meta);
  });
});
