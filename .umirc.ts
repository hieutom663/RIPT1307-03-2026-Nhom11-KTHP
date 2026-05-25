import { defineConfig } from "umi";
import routes from './config/routes';

export default defineConfig({
  routes: routes,
  proxy: {
    '/api': {
      'target': 'http://localhost:3000', 
      'changeOrigin': true,
    },
  },
  npmClient: 'npm',
  esbuildMinifyIIFE: true,
});
