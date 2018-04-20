import {Observer} from './vue-internals';

export function defineWatchersProperty(obj) {
  if (obj.hasOwnProperty('_watchers')) {
    return;
  }

  Object.defineProperty(obj, '_watchers', {
    value: [],
    enumerable: false
  });
}

export function markAsStatic(obj) {
  // Tells Vue that it doesn't need to make all properties of this object reactive
  Object.defineProperty(obj, '__ob__', {
    enumerable: false,
    value: new Observer({})
  });

  return obj;
}
