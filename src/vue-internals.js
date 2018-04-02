import Vue from 'vue';

const vue = new Vue({
  watch: {
    w() {}
  }
});

export const Watcher = vue._watchers[0].constructor;
export const Observer = vue.$data.__ob__.constructor;
export const Dep = vue.$data.__ob__.dep.constructor;
export const {defineReactive} = Vue.util;
