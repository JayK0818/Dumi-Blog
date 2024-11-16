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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        title: 'NodeJS',
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        title: 'Vue',
        link: '/vue'
      },
      {
        title: 'React',
        link: '/react'
      },
      {
        title: 'Node',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        link: '/node'
      }
    ],
    lastUpdated: true,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    nprogress: true,
    showLineNum: true
  },
  base: '/',
=======
    showLineNum: true, // 是否在代码块中展示行号
    nprogress: true, //
    base: './'
  },
>>>>>>> Stashed changes
=======
    showLineNum: true, // 是否在代码块中展示行号
    nprogress: true, //
    base: './'
  },
>>>>>>> Stashed changes
=======
    showLineNum: true, // 是否在代码块中展示行号
    nprogress: true, //
    base: './'
  },
>>>>>>> Stashed changes
  presets: ['@dumijs/preset-vue']
});
