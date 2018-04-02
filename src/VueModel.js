import {Observer} from './vue-internals';

export class VueModel {

  constructor(data) {
    Object.defineProperty(this, '__ob__', {
      enumerable: false,
      value: new Observer({})
    });

    if (data) {
      Object.assign(this, data);
    }
  }

}
