const {expect} = require('chai');
const {observable, computed, VueModel} = require('../dist/vue-model-x');

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

let user;
const createUser = () => user = new User({firstName: 'a', lastName: 'b', age: 10});;

describe('@observable', () => {
  beforeEach(createUser);

  it('should not list unassigned observables in `Object.keys`', () => {
    const user = new User();
    expect(Object.keys(user)).to.deep.equal([]);
  });

  it('should list assigned observables in `Object.keys`', () => {
    expect(Object.keys(user)).to.deep.equal(['firstName', 'lastName', 'age']);
  });

});

describe('@computed', () => {
  beforeEach(createUser);

  it('should not be enumerable', () => {
    expect(user.isAdult).to.equal(false);
    expect(Object.keys(user)).to.not.include('isAdult');
  });

  it('should return computed value', function () {
    expect(user.isAdult).to.equal(false);
  });

  it('should cache computed value if in reactive context', function () {
    expect(user.isAdult).to.equal(false);
  });

  it('should not cache computed value if not in reactive context', function () {
    expect(user.isAdult).to.be.false;
    user.age = 20;
    expect(user.isAdult).to.be.true;
  });

  it("should throw when it's not a getter", () => {
    function createInvalidClass() {
      return class Foo {
        @computed bar() {}
      };
    }
    expect(createInvalidClass).to.throw(TypeError, /^Foo#bar is not a getter/);
  });

});

