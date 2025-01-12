import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: '牧童的博客',
    nav: [
      {
        title: 'JavaScript',
        link: '/javascript'
      },
      {
        title: 'Node',
        link: '/node'
      },
      {
        title: '案例',
        link: '/demo'
      }
    ],
    lastUpdated: true,
    nprogress: true,
    showLineNum: true
  },
  base: '/',
  presets: ['@dumijs/preset-vue'],
  plugins: ['dumi-plugin-color-chunk']
});
