export function defineWatchersProperty(obj) {
  Object.defineProperty(obj, '_watchers', {
    value: [],
    enumerable: false
  });
}
