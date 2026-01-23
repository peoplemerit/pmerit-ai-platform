import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'validation/index': 'src/validation/index.ts',
    'gates/index': 'src/gates/index.ts',
    'formula/index': 'src/formula/index.ts',
    'variants/index': 'src/variants/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
