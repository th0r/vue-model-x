import {mount} from '@vue/test-utils';
import {defineWatchersProperty} from '../src/utils';
import {markAsStatic} from '../src';

describe('utils', function () {
  let obj;

  beforeEach(() => {
    obj = {};
  });

  describe('defineWatchersProperty', function () {

    it('should define `_watchers` property', function () {
      defineWatchersProperty(obj);
      expect(obj._watchers).toEqual([]);
    });

    it('`_watchers` property should not be enumerable', function () {
      defineWatchersProperty(obj);
      expect(Object.keys(obj)).toEqual([]);
    });

    it('should not throw if `_watchers` property already exists', function () {
      Object.defineProperty(obj, '_watchers', {
        value: [],
        configurable: false
      });
      expect(() => defineWatchersProperty(obj)).not.toThrow();
    });

  });

  describe('markAsStatic', function () {

    it('should return marked object', function () {
      expect(markAsStatic(obj)).toBe(obj);
    });

    it('Vue should not react to changes in object marked as static', function () {
      const TestComponent = {
        template: `
          <div>
            <span id="reactive">{{ reactiveObj.prop }}-{{ reactiveObj.nested.prop }}</span>
            <span id="static">{{ staticObj.prop }}-{{ staticObj.nested.prop }}</span>
          </div>
        `,

        data() {
          return {
            reactiveObj: {
              prop: 1,
              nested: {
                prop: 1
              }
            },

            staticObj: markAsStatic({
              prop: 1,
              nested: {
                prop: 1
              }
            })
          };
        }
      };
      const comp = mount(TestComponent);

      expect(comp.find('#reactive').text()).toEqual('1-1');
      expect(comp.find('#static').text()).toEqual('1-1');
      comp.vm.reactiveObj.prop = 2;
      comp.vm.reactiveObj.nested.prop = 2;
      comp.vm.staticObj.prop = 2;
      comp.vm.staticObj.nested.prop = 2;
      expect(comp.find('#reactive').text()).toEqual('2-2');
      expect(comp.find('#static').text()).toEqual('1-1');
    });

  });

});
