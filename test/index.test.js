import {observable, computed, VueModel} from '../src';
import {mount} from '@vue/test-utils';
import {createRenderer} from 'vue-server-renderer';

const renderer = createRenderer();

function render(component) {
  return renderer.renderToString(component.vm);
}

class User extends VueModel {
  @observable firstName;
  @observable lastName;
  @observable age;

  constructor(data) {
    super(data);
  }

  @computed get isAdult() {
    return this.age >= 18;
  }
}

const UserComponent = {
  template: `
    <div>
      ID: {{ id }}
      First name: {{ user.firstName }}
      Adult: {{ user.isAdult }}
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
const createUser = () => user = new User({firstName: 'a', lastName: 'b', age: 10});
const createComponent = (Comp = UserComponent, user = createUser()) => {
  comp = mount(Comp, {propsData: {user}});
};

describe('@observable', () => {
  beforeEach(createUser);

  test('should not list unassigned observables in `Object.keys`', () => {
    const user = new User();
    expect(Object.keys(user)).toEqual([]);
  });

  test('should list assigned observables in `Object.keys`', () => {
    expect(Object.keys(user)).toEqual(['firstName', 'lastName', 'age']);
  });
});

describe('@computed', () => {
  beforeEach(createUser);

  test('should not be enumerable', () => {
    expect(user.isAdult).toBe(false);
    expect(Object.keys(user)).not.toContain('isAdult');
  });

  test('should return computed value', function () {
    expect(user.isAdult).toBe(false);
  });

  test('should cache computed value if in reactive context', function () {
    expect(user.isAdult).toBe(false);
  });

  test('should not cache computed value if not in reactive context', function () {
    expect(user.isAdult).toBe(false);
    user.age = 20;
    expect(user.isAdult).toBe(true);
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
    expect(await render(comp)).toMatchSnapshot('before change');
    user.firstName = 'John';
    expect(await render(comp)).toMatchSnapshot('after change');
  });

  test('should react on changes in computed', async () => {
    createComponent();
    expect(await render(comp)).toMatchSnapshot('before change');
    user.age = 20;
    expect(await render(comp)).toMatchSnapshot('after change');
  });

  test("component's computed properties should react on changes in model's observables", async () => {
    createComponent();
    expect(await render(comp)).toMatchSnapshot('before change');
    user.lastName = 'Norris';
    expect(await render(comp)).toMatchSnapshot('after change');
  });

  test("component's computed properties should react on changes in model's computed", async () => {
    createComponent();
    expect(await render(comp)).toMatchSnapshot('before change');
    user.age = 20;
    expect(await render(comp)).toMatchSnapshot('after change');
  });
});

