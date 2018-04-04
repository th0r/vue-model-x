import {Observer} from './vue-internals';

export class VueModel {

  constructor() {
    // Tells Vue that it doesn't need to convert all properties of this object to reactive because
    // we explicitly mark reactive properties with `@observable` and `@computed` decorators.
    // All other properties shouldn't be reactive.
    Object.defineProperty(this, '__ob__', {
      enumerable: false,
      value: new Observer({})
    });
  }

  update(data) {
    Object.assign(this, data);
  }

}
