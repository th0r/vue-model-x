'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

var vue = new Vue({
  watch: {
    w: function w() {}
  }
});
var Watcher = vue._watchers[0].constructor;
var Observer = vue.$data.__ob__.constructor;
var Dep = vue.$data.__ob__.dep.constructor;
var defineReactive = Vue.util.defineReactive;

var observableValues = Symbol('observableValues');
function observable(proto, name, descriptor) {
  var reactiveDescriptor = {
    configurable: true,
    enumerable: true,
    get: function get() {
      var value;

      if (this.hasOwnProperty(observableValues) && name in this[observableValues]) {
        value = this[observableValues][name];
      } else {
        value = descriptor.initializer();
        saveObservableValue(this, name, value);
      }

      if (Dep.target) {
        defineReactiveProperty(this, name, value, descriptor); // Should call newly created getter in order to set reactive dependency

        return this[name];
      } else {
        return value;
      }
    },
    set: function set(value) {
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

function defineReactiveProperty(obj, name, value, originalPropertyDescriptor) {
  // Defining original property
  originalPropertyDescriptor.configurable = true;
  Object.defineProperty(obj, name, originalPropertyDescriptor); // Converting it to reactive

  defineReactive(obj, name, value);
}

function saveObservableValue(obj, name, value) {
  if (!obj.hasOwnProperty(observableValues)) {
    obj[observableValues] = Object.create(null);
  }

  obj[observableValues][name] = value;
}

var computedWatchers = Symbol('computedWatchers');

var noop = function noop() {};

function computed(prototype, getterName, descriptor) {
  var getter = descriptor.get;

  if (!getter) {
    throw new TypeError(prototype.constructor.name + "#" + getterName + " is not a getter so it can't be used as computed property");
  }

  return {
    configurable: true,
    enumerable: true,
    get: function get() {
      if (!Dep.target) {
        return getter.call(this);
      }

      if (!this.hasOwnProperty(computedWatchers)) {
        // Needed by Vue's `Watcher` constructor
        this._watchers = [];
        this[computedWatchers] = new Map();
      }

      if (!this[computedWatchers].has(prototype)) {
        this[computedWatchers].set(prototype, Object.create(null));
      }

      var watchers = this[computedWatchers].get(prototype);
      var watcher = watchers[getterName];

      if (!watcher) {
        // Lazily creating computed watcher
        watcher = watchers[getterName] = new Watcher(this, getter, noop, {
          lazy: true
        });
      }

      if (watcher.dirty) {
        watcher.evaluate();
      }

      watcher.depend();
      return watcher.value;
    }
  };
}

var VueModel = function VueModel(data) {
  Object.defineProperty(this, '__ob__', {
    enumerable: false,
    value: new Observer({})
  });

  if (data) {
    Object.assign(this, data);
  }
};

exports.observable = observable;
exports.computed = computed;
exports.VueModel = VueModel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLW1vZGVsLXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy92dWUtaW50ZXJuYWxzLmpzIiwiLi4vc3JjL29ic2VydmFibGUuanMiLCIuLi9zcmMvY29tcHV0ZWQuanMiLCIuLi9zcmMvVnVlTW9kZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnO1xuXG5jb25zdCB2dWUgPSBuZXcgVnVlKHtcbiAgd2F0Y2g6IHtcbiAgICB3KCkge31cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBXYXRjaGVyID0gdnVlLl93YXRjaGVyc1swXS5jb25zdHJ1Y3RvcjtcbmV4cG9ydCBjb25zdCBPYnNlcnZlciA9IHZ1ZS4kZGF0YS5fX29iX18uY29uc3RydWN0b3I7XG5leHBvcnQgY29uc3QgRGVwID0gdnVlLiRkYXRhLl9fb2JfXy5kZXAuY29uc3RydWN0b3I7XG5leHBvcnQgY29uc3Qge2RlZmluZVJlYWN0aXZlfSA9IFZ1ZS51dGlsO1xuIiwiaW1wb3J0IHtEZXAsIGRlZmluZVJlYWN0aXZlfSBmcm9tICcuL3Z1ZS1pbnRlcm5hbHMnO1xuXG5jb25zdCBvYnNlcnZhYmxlVmFsdWVzID0gU3ltYm9sKCdvYnNlcnZhYmxlVmFsdWVzJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZhYmxlKHByb3RvLCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gIGNvbnN0IHJlYWN0aXZlRGVzY3JpcHRvciA9IHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcblxuICAgIGdldCgpIHtcbiAgICAgIGxldCB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkob2JzZXJ2YWJsZVZhbHVlcykgJiYgbmFtZSBpbiB0aGlzW29ic2VydmFibGVWYWx1ZXNdKSB7XG4gICAgICAgIHZhbHVlID0gdGhpc1tvYnNlcnZhYmxlVmFsdWVzXVtuYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gZGVzY3JpcHRvci5pbml0aWFsaXplcigpO1xuICAgICAgICBzYXZlT2JzZXJ2YWJsZVZhbHVlKHRoaXMsIG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKERlcC50YXJnZXQpIHtcbiAgICAgICAgZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB2YWx1ZSwgZGVzY3JpcHRvcik7XG4gICAgICAgIC8vIFNob3VsZCBjYWxsIG5ld2x5IGNyZWF0ZWQgZ2V0dGVyIGluIG9yZGVyIHRvIHNldCByZWFjdGl2ZSBkZXBlbmRlbmN5XG4gICAgICAgIHJldHVybiB0aGlzW25hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXQodmFsdWUpIHtcbiAgICAgIGlmIChEZXAudGFyZ2V0KSB7XG4gICAgICAgIGRlZmluZVJlYWN0aXZlUHJvcGVydHkodGhpcywgbmFtZSwgdmFsdWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgLy8gRGVmaW5pbmcgcmVhY3RpdmUgZGVzY3JpcHRvciBvbiB0aGUgb2JqZWN0IGl0c2VsZiBpbiBvcmRlciB0byBgT2JqZWN0LmtleXNgIHRvIGxpc3QgaXRcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgcmVhY3RpdmVEZXNjcmlwdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBzYXZlT2JzZXJ2YWJsZVZhbHVlKHRoaXMsIG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHJlYWN0aXZlRGVzY3JpcHRvcjtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIG5hbWUsIHZhbHVlLCBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvcikge1xuICAvLyBEZWZpbmluZyBvcmlnaW5hbCBwcm9wZXJ0eVxuICBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCBvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvcik7XG4gIC8vIENvbnZlcnRpbmcgaXQgdG8gcmVhY3RpdmVcbiAgZGVmaW5lUmVhY3RpdmUob2JqLCBuYW1lLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHNhdmVPYnNlcnZhYmxlVmFsdWUob2JqLCBuYW1lLCB2YWx1ZSkge1xuICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShvYnNlcnZhYmxlVmFsdWVzKSkge1xuICAgIG9ialtvYnNlcnZhYmxlVmFsdWVzXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cblxuICBvYmpbb2JzZXJ2YWJsZVZhbHVlc11bbmFtZV0gPSB2YWx1ZTtcbn1cbiIsImltcG9ydCB7RGVwLCBXYXRjaGVyfSBmcm9tICcuL3Z1ZS1pbnRlcm5hbHMnO1xuXG5jb25zdCBjb21wdXRlZFdhdGNoZXJzID0gU3ltYm9sKCdjb21wdXRlZFdhdGNoZXJzJyk7XG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlZChwcm90b3R5cGUsIGdldHRlck5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgY29uc3QgZ2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG5cbiAgaWYgKCFnZXR0ZXIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgYCR7cHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9IyR7Z2V0dGVyTmFtZX0gaXMgbm90IGEgZ2V0dGVyIHNvIGl0IGNhbid0IGJlIHVzZWQgYXMgY29tcHV0ZWQgcHJvcGVydHlgXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0KCkge1xuICAgICAgaWYgKCFEZXAudGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBnZXR0ZXIuY2FsbCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KGNvbXB1dGVkV2F0Y2hlcnMpKSB7XG4gICAgICAgIC8vIE5lZWRlZCBieSBWdWUncyBgV2F0Y2hlcmAgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSBbXTtcbiAgICAgICAgdGhpc1tjb21wdXRlZFdhdGNoZXJzXSA9IG5ldyBNYXAoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzW2NvbXB1dGVkV2F0Y2hlcnNdLmhhcyhwcm90b3R5cGUpKSB7XG4gICAgICAgIHRoaXNbY29tcHV0ZWRXYXRjaGVyc10uc2V0KHByb3RvdHlwZSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdhdGNoZXJzID0gdGhpc1tjb21wdXRlZFdhdGNoZXJzXS5nZXQocHJvdG90eXBlKTtcbiAgICAgIGxldCB3YXRjaGVyID0gd2F0Y2hlcnNbZ2V0dGVyTmFtZV07XG5cbiAgICAgIGlmICghd2F0Y2hlcikge1xuICAgICAgICAvLyBMYXppbHkgY3JlYXRpbmcgY29tcHV0ZWQgd2F0Y2hlclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbZ2V0dGVyTmFtZV0gPSBuZXcgV2F0Y2hlcih0aGlzLCBnZXR0ZXIsIG5vb3AsIHtsYXp5OiB0cnVlfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh3YXRjaGVyLmRpcnR5KSB7XG4gICAgICAgIHdhdGNoZXIuZXZhbHVhdGUoKTtcbiAgICAgIH1cblxuICAgICAgd2F0Y2hlci5kZXBlbmQoKTtcblxuICAgICAgcmV0dXJuIHdhdGNoZXIudmFsdWU7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHtPYnNlcnZlcn0gZnJvbSAnLi92dWUtaW50ZXJuYWxzJztcblxuZXhwb3J0IGNsYXNzIFZ1ZU1vZGVsIHtcblxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfX29iX18nLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBuZXcgT2JzZXJ2ZXIoe30pXG4gICAgfSk7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcbiAgICB9XG4gIH1cblxufVxuIl0sIm5hbWVzIjpbInZ1ZSIsIlZ1ZSIsIldhdGNoZXIiLCJfd2F0Y2hlcnMiLCJjb25zdHJ1Y3RvciIsIk9ic2VydmVyIiwiJGRhdGEiLCJfX29iX18iLCJEZXAiLCJkZXAiLCJkZWZpbmVSZWFjdGl2ZSIsInV0aWwiLCJvYnNlcnZhYmxlVmFsdWVzIiwiU3ltYm9sIiwib2JzZXJ2YWJsZSIsInByb3RvIiwibmFtZSIsImRlc2NyaXB0b3IiLCJyZWFjdGl2ZURlc2NyaXB0b3IiLCJ2YWx1ZSIsImhhc093blByb3BlcnR5IiwiaW5pdGlhbGl6ZXIiLCJ0YXJnZXQiLCJkZWZpbmVQcm9wZXJ0eSIsImRlZmluZVJlYWN0aXZlUHJvcGVydHkiLCJvYmoiLCJvcmlnaW5hbFByb3BlcnR5RGVzY3JpcHRvciIsImNvbmZpZ3VyYWJsZSIsInNhdmVPYnNlcnZhYmxlVmFsdWUiLCJPYmplY3QiLCJjcmVhdGUiLCJjb21wdXRlZFdhdGNoZXJzIiwibm9vcCIsImNvbXB1dGVkIiwicHJvdG90eXBlIiwiZ2V0dGVyTmFtZSIsImdldHRlciIsImdldCIsIlR5cGVFcnJvciIsImNhbGwiLCJNYXAiLCJoYXMiLCJzZXQiLCJ3YXRjaGVycyIsIndhdGNoZXIiLCJkaXJ0eSIsImV2YWx1YXRlIiwiZGVwZW5kIiwiVnVlTW9kZWwiLCJkYXRhIiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBLElBQU1BLE1BQU0sSUFBSUMsR0FBSixDQUFRO1NBQ1g7S0FBQSxlQUNEOztDQUZJLENBQVo7QUFNQSxBQUFPLElBQU1DLFVBQVVGLElBQUlHLFNBQUosQ0FBYyxDQUFkLEVBQWlCQyxXQUFqQztBQUNQLEFBQU8sSUFBTUMsV0FBV0ws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
