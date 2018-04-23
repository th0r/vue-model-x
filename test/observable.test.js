import Vue from 'vue';
import {mount} from '@vue/test-utils';
import {observable} from '../src';
import {User} from './models/User';
import UserComponent from './components/UserComponent';

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

describe('@observable', () => {
  it('should return initial value', () => {
    class Test {
      @observable foo = 'bar';
    }
    expect(new Test().foo).toBe('bar');
  });

  it('should not list unassigned observables in `Object.keys`', () => {
    const user = new User();
    expect(Object.keys(user)).toEqual(['roles']);
  });

  it('should list assigned observables in `Object.keys`', () => {
    const user = new User({
      firstName: 'Chuck',
      lastName: 'Norris',
      age: 50,
      roles: ['karate-god']
    });
    expect(Object.keys(user)).toEqual(['roles', 'firstName', 'lastName', 'age']);
  });

  it('components should react to changes in observables', async () => {
    createComponent();
    expect(comp.find('#firstName').text()).toEqual('Chuck');
    user.firstName = 'John';
    await Vue.nextTick();
    expect(comp.find('#firstName').text()).toEqual('John');
  });

  it("component's computed properties should react to changes in observables", async () => {
    createComponent();
    expect(comp.find('#id').text()).toEqual('chuck-norris-true');
    user.lastName = 'Palahniuk';
    await Vue.nextTick();
    expect(comp.find('#id').text()).toEqual('chuck-palahniuk-true');
  });
});
