import Vue from 'vue';
import {mount} from '@vue/test-utils';
import {computed} from '../src';
import UserComponent from './components/UserComponent';
import {User} from './models/User';

let user;
let comp;
const createUser = () => user = new User({
  firstName: 'Chuck',
  lastName: 'Norris',
  age: 50
});
const createComponent = (user = createUser()) => {
  comp = mount(UserComponent, {propsData: {user}, sync: false});
};

describe('@computed', () => {
  beforeEach(createUser);

  it('should return computed value', function () {
    expect(user.isAdult).toBe(true);
  });

  it('should not be enumerable', () => {
    expect(Object.keys(user)).not.toContain('isAdult');
  });

  it('should cache computed value if in reactive context', async function () {
    const user = createUser();
    const isAdultGetter = user._getIsAdult = jest.fn(user._getIsAdult.bind(user));
    createComponent(user);
    expect(isAdultGetter).toHaveBeenCalledTimes(1);
    comp.vm.$forceUpdate();
    expect(isAdultGetter).toHaveBeenCalledTimes(1);
    user.firstName = 'Foo';
    await Vue.nextTick();
    expect(isAdultGetter).toHaveBeenCalledTimes(1);
    user.age = 17;
    await Vue.nextTick();
    expect(isAdultGetter).toHaveBeenCalledTimes(2);
  });

  it('should not cache computed value if not in reactive context', function () {
    const user = createUser();
    const isAdultGetter = user._getIsAdult = jest.fn(user._getIsAdult.bind(user));
    expect(user.isAdult).toBe(true);
    expect(isAdultGetter).toHaveBeenCalledTimes(1);
    expect(user.isAdult).toBe(true);
    expect(isAdultGetter).toHaveBeenCalledTimes(2);
    user.age = 17;
    expect(user.isAdult).toBe(false);
    expect(isAdultGetter).toHaveBeenCalledTimes(3);
  });

  it("should throw when it's not a getter", () => {
    function createInvalidClass() {
      return class Foo {
        @computed bar() {}
      };
    }
    expect(createInvalidClass).toThrowErrorMatchingSnapshot();
  });

  it('components should react on changes in computed', async () => {
    createComponent();
    expect(comp.find('#isAdult').text()).toEqual('yes');
    user.age = 17;
    await Vue.nextTick();
    expect(comp.find('#isAdult').text()).toEqual('no');
  });

  it("component's computed properties should react to changes in computed", async () => {
    createComponent();
    expect(comp.find('#id').text()).toEqual('chuck-norris-true');
    user.age = 17;
    await Vue.nextTick();
    expect(comp.find('#id').text()).toEqual('chuck-norris-false');
  });
});
