import {computed, Model, observable} from '../../src';

export class User extends Model {
  @observable firstName = '';
  @observable lastName = '';
  @observable age = null;
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
