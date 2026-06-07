import { defineConfig } from "umi";
import routes from './config/routes';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/model'],
  model: {},
  routes: routes,
  proxy: {
    '/api': {
      'target': 'http://localhost:20226', 
      'changeOrigin': true,
    },
  },
  npmClient: 'npm',
  esbuildMinifyIIFE: true,
});
