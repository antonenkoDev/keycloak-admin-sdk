import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

// Parse package.json
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

// External dependencies that should not be bundled
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default [
  // ESM and CommonJS bundles
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module || 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main || 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        name: 'KeycloakAdminSDK',
        file: pkg.unpkg || 'dist/index.umd.js',
        format: 'umd',
        sourcemap: true,
        globals: {
          'node-fetch': 'fetch'
        }
      }
    ],
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
        outDir: 'dist',
      }),
    ],
  },
  // TypeScript declarations bundle
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
