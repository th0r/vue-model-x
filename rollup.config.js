import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-model-x.js',
      format: 'cjs'
    },
    {
      file: 'dist/vue-model-x.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonJs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['vue']
};
