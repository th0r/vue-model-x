export const storeMeta = Symbol('VueModelXStoreMeta');

export function store(meta) {
  return function storeDecorator(cls) {
    if (!meta) {
      throw new TypeError(
        /* eslint max-len: "off" */
        `VueModelX: you must provide options for "@store" decorator with at least "name" property for "${cls.name}" class`
      );
    }

    if (!meta.name) {
      throw new TypeError(`VueModelX: you must provide store name for "${cls.name}" class`);
    }

    Object.defineProperty(cls, storeMeta, {
      value: meta,
      enumerable: false
    });
  };
}
