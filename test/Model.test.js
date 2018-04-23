import Vue from 'vue';
import {mount} from '@vue/test-utils';
import UserComponent from './components/UserComponent';
import {User} from './models/User';

let user;
let comp;
const createUser = () => user = new User({
  roles: ['karate-god']
});
const createComponent = (user = createUser()) => {
  comp = mount(UserComponent, {propsData: {user}, sync: false});
};

describe('Model', function () {

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
