import { defineConfig } from "umi";
import routes from './config/routes';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/model'],
  model: {},
  routes: routes,
  proxy: {
    '/api': {
      'target': 'https://ript1307-03-2026-nhom11-kthp-1.onrender.com', 
      'changeOrigin': true,
    },
  },
  npmClient: 'npm',
  esbuildMinifyIIFE: true,
});
