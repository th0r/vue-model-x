import Vue from 'vue';
import {mount} from '@vue/test-utils';
import {observable, computed, Model} from '../src';

class User extends Model {
  @observable firstName;
  @observable lastName;
  @observable age;
  // Non-reactive property
  roles = [];

  constructor(data) {
    super();
    this.update(data);
  }

  @computed get isAdult() {
    return this._getIsAdult();
  }

  _getIsAdult() {
    return this.age >= 18;
  }
}

const UserComponent = {
  template: `
    <div>
      ID: <span id="id">{{ id }}</span>
      First name: <span id="firstName">{{ user.firstName }}</span>
      Adult: <span id="isAdult">{{ user.isAdult ? 'yes' : 'no' }}</span>
      Roles: <span id="roles">{{ user.roles.join(', ') }}</span>
    </div>
  `,

  props: ['user'],

  computed: {
    id() {
      return `${this.user.firstName.toLowerCase()}-${this.user.lastName.toLowerCase()}-${this.user.isAdult}`;
    }
  }
};

let user;
let comp;
const createUser = () => user = new User({
  firstName: 'Chuck',
  lastName: 'Norris',
  age: 50,
  roles: ['karate-god']
});
const createComponent = (user = createUser()) => {
  comp = mount(UserComponent, {propsData: {user}, sync: false});
};

describe('@observable', () => {
  beforeEach(createUser);

  test('should return initial value', () => {
    class Test {
      @observable foo = 'bar';
    }
    expect(new Test().foo).toBe('bar');
  });

  test('should not list unassigned observables in `Object.keys`', () => {
    const user = new User();
    expect(Object.keys(user)).toEqual(['roles']);
  });

  test('should list assigned observables in `Object.keys`', () => {
    expect(Object.keys(user)).toEqual(['roles', 'firstName', 'lastName', 'age']);
  });
});

describe('@computed', () => {
  beforeEach(createUser);

  test('should return computed value', function () {
    expect(user.isAdult).toBe(true);
  });

  test('should not be enumerable', () => {
    expect(Object.keys(user)).not.toContain('isAdult');
  });

  test('should cache computed value if in reactive context', async function () {
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

  test('should not cache computed value if not in reactive context', function () {
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

  test("should throw when it's not a getter", () => {
    function createInvalidClass() {
      return class Foo {
        @computed bar() {}
      };
    }
    expect(createInvalidClass).toThrowErrorMatchingSnapshot();
  });
});

describe('vue components', () => {
  test('should react on changes in observables', async () => {
    createComponent();
    expect(comp.find('#firstName').text()).toEqual('Chuck');
    user.firstName = 'John';
    await Vue.nextTick();
    expect(comp.find('#firstName').text()).toEqual('John');
  });

  test('should react on changes in computed', async () => {
    createComponent();
    expect(comp.find('#isAdult').text()).toEqual('yes');
    user.age = 17;
    await Vue.nextTick();
    expect(comp.find('#isAdult').text()).toEqual('no');
  });

  test('should not react on changes in non-reactive properties', async () => {
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

  test("component's computed properties should react on changes in model's observables", async () => {
    createComponent();
    expect(comp.find('#id').text()).toEqual('chuck-norris-true');
    user.lastName = 'Palahniuk';
    await Vue.nextTick();
    expect(comp.find('#id').text()).toEqual('chuck-palahniuk-true');
  });

  test("component's computed properties should react on changes in model's computed", async () => {
    createComponent();
    expect(comp.find('#id').text()).toEqual('chuck-norris-true');
    user.age = 17;
    await Vue.nextTick();
    expect(comp.find('#id').text()).toEqual('chuck-norris-false');
  });
});
