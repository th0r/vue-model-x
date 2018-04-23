import {store} from '../src';
import {storeMeta} from '../src/storeDecorator';

describe('@store', () => {
  it('should throw an error if decorator is called without options', () => {
    function createStore() {
      return @store()
      class Store {};
    }

    expect(createStore).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if decorator options don't provide store name", () => {
    function createStore() {
      return @store({deps: {}})
      class Store {};
    }

    expect(createStore).toThrowErrorMatchingSnapshot();
  });

  it('should attach metadata to store class', () => {
    const meta = {
      name: 'Store'
    };

    @store(meta)
    class Store {};

    expect(Store[storeMeta]).toEqual(meta);
  });
});
