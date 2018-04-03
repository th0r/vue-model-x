import {Dep, defineReactive} from './vue-internals';

const observableValues = Symbol('observableValues');

export function observable(proto, name, descriptor) {
  Object.assign(descriptor, {
    configurable: true,
    writable: true
  });

  const reactiveDescriptor = {
    configurable: true,
    enumerable: true,

    get() {
      let value;

      if (this.hasOwnProperty(observableValues) && name in this[observableValues]) {
        value = this[observableValues][name];
      } else {
        value = descriptor.initializer();
        saveObservableValue(this, name, value);
      }

      if (Dep.target) {
        defineReactiveProperty(this, name, value, descriptor);
        // Should call newly created getter in order to set reactive dependency
        return this[name];
      } else {
        return value;
      }
    },

    set(value) {
      if (Dep.target) {
        defineReactiveProperty(this, name, value, descriptor);
      } else {
        if (!this.hasOwnProperty(name)) {
          // Defining reactive descriptor on the object itself in order to `Object.keys` to list it
          Object.defineProperty(this, name, reactiveDescriptor);
        }
        saveObservableValue(this, name, value);
      }
    }
  };

  return reactiveDescriptor;
}

function defineReactiveProperty(obj, name, value, originalDescriptor) {
  // Defining original property
  Object.defineProperty(obj, name, originalDescriptor);
  // Converting it to reactive
  defineReactive(obj, name, value);
}

function saveObservableValue(obj, name, value) {
  if (!obj.hasOwnProperty(observableValues)) {
    obj[observableValues] = Object.create(null);
  }

  obj[observableValues][name] = value;
}
