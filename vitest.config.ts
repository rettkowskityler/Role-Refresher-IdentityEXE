import { readFileSync } from 'node:fs';

import { defineConfig, type Plugin } from 'vitest/config';

/**
 * @sailpoint/ui-plugin-sdk publishes .js.map files that reference ../src/*.ts,
 * but the npm package only ships dist/. When Vitest inlines the SDK, Vite tries
 * to load those sources and warns. Strip sourceMappingURL comments so the maps
 * are never extracted.
 */
function stripSdkSourceMapComments(): Plugin {
  return {
    name: 'strip-sailpoint-sdk-sourcemaps',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0];
      if (!file.includes('node_modules/@sailpoint/ui-plugin-sdk/') || !file.endsWith('.js')) {
        return null;
      }

      const code = readFileSync(file, 'utf-8').replace(/\n?\/\/# sourceMappingURL=.*$/gm, '');
      return code;
    },
  };
}

// @sailpoint/ui-plugin-sdk ships extensionless ESM relative imports; Node cannot
// load it when Vitest externalizes node_modules. Inline so Vite resolves/bundles it.
export default defineConfig({
  plugins: [stripSdkSourceMapComments()],
  test: {
    setupFiles: ['src/test-setup.ts'],
    server: {
      deps: {
        inline: ['@sailpoint/ui-plugin-sdk'],
      },
    },
  },
});
