import Vue from 'vue';
import {mount} from '@vue/test-utils';
import UserComponent from './components/UserComponent';
import {User} from './models/User';
import {defineWatchersProperty} from '../src/utils';

let user;
let comp;
const createUser = () => user = new User({
  age: 30,
  address: {
    city: 'Domodedovo'
  },
  roles: ['admin']
});
const createComponent = (user = createUser()) => {
  comp = mount(UserComponent, {propsData: {user}, sync: false});
};

describe('Model', function () {
  let cb;

  beforeEach(() => {
    createUser();
    cb = jest.fn();
  });

  describe('#watch', function () {

    it('should invoke callback if watch expression changes', async function () {
      user.watch(() => [user.firstName, user.isAdult], cb);
      expect(cb).not.toBeCalled();
      user.firstName = 'Chuck';
      expect(cb).not.toBeCalled();
      await Vue.nextTick();
      expect(cb).toBeCalledWith(['Chuck', true], ['', true]);
      user.age = 17;
      expect(cb).toHaveBeenCalledTimes(1);
      await Vue.nextTick();
      expect(cb).toBeCalledWith(['Chuck', false], ['Chuck', true]);
      user.firstName = 'Alisa';
      user.age = 18;
      expect(cb).toHaveBeenCalledTimes(2);
      await Vue.nextTick();
      expect(cb).toHaveBeenCalledTimes(3);
      expect(cb).toBeCalledWith(['Alisa', true], ['Chuck', false]);
    });

    it('should allow simple path as watch expression', async function () {
      user.watch('address.city', cb);
      user.address.city = 'Moscow';
      await Vue.nextTick();
      expect(cb).toBeCalledWith('Moscow', 'Domodedovo');
    });

    it('should allow method name as callback', async function () {
      user.callbackMethod = cb;
      user.watch('age', 'callbackMethod');
      user.age = 18;
      await Vue.nextTick();
      expect(user.callbackMethod).toBeCalledWith(18, 30);
    });

    it("should throw if callback is a method name and this method doesn't exist", function () {
      expect(() => user.watch('age', 'nonExistingMethod')).toThrowErrorMatchingSnapshot();
    });

    it('should return function that stops watcher', async function () {
      const stopWatcher = user.watch('age', cb);
      user.age = 18;
      await Vue.nextTick();
      expect(cb).toHaveBeenCalledTimes(1);
      stopWatcher();
      user.age = 19;
      await Vue.nextTick();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('should work if model already has `_watchers` property', async function () {
      expect(user._watchers).not.toBeDefined();
      defineWatchersProperty(user);
      expect(user._watchers).toBeDefined();
      user.watch('age', cb);
      user.age = 18;
      await Vue.nextTick();
      expect(cb).toBeCalledWith(18, 30);
    });

    describe('options', function () {
      describe('immediate', function () {
        it('should immediately invoke callback', async function () {
          user.watch('age', cb, {immediate: true});
          expect(cb).toBeCalledWith(30);
          expect(cb).toHaveBeenCalledTimes(1);
          user.age = 18;
          await Vue.nextTick();
          expect(cb).toBeCalledWith(18, 30);
          expect(cb).toHaveBeenCalledTimes(2);
        });

        it('should immediately invoke callback as method name', async function () {
          user.callbackMethod = cb;
          user.watch('age', 'callbackMethod', {immediate: true});
          expect(user.callbackMethod).toBeCalledWith(30);
        });
      });

      describe('deep', function () {
        it('should invoke callback when deep property changes', async function () {
          user.watch('address', cb, {deep: true});
          user.address.city = 'Moscow';
          await Vue.nextTick();
          expect(cb).toBeCalledWith(user.address, user.address);
        });

        it('should be `false` by default', async function () {
          user.watch('address', cb);
          user.address.city = 'Moscow';
          await Vue.nextTick();
          expect(cb).not.toBeCalled();
        });
      });

      describe('sync', function () {
        it('should invoke callback immediately after change', async function () {
          user.watch('age', cb, {sync: true});
          expect(cb).not.toBeCalled();
          user.age = 18;
          expect(cb).toBeCalledWith(18, 30);
          await Vue.nextTick();
          expect(cb).toHaveBeenCalledTimes(1);
        });

        it('should be `false` by default', async function () {
          user.watch('age', cb);
          expect(cb).not.toBeCalled();
          user.age = 18;
          expect(cb).not.toBeCalled();
          await Vue.nextTick();
          expect(cb).toHaveBeenCalledTimes(1);
        });
      });
    });

  });

  it('component should not react to changes in non-reactive model properties', async () => {
    createComponent();
    const defaultRoles = user.roles.join(', ');
    expect(comp.find('#roles').text()).toEqual(defaultRoles);
    user.roles.push('admin');
    await Vue.nextTick();
    expect(comp.find('#roles').text()).toEqual(defaultRoles);
    user.roles = ['foo'];
    await Vue.nextTick();
    expect(comp.find('#roles').text()).toEqual(defaultRoles);
  });

});
