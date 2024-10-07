import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "系统设计面试：内幕指南",
  description: "《System Design Interview: An Insider’s Guide》 中文翻译",
  base: '/system-design-interview',
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/honkinglin/system-design-interview/edit/main/docs/:path'
    },

    sidebar: [
      {
        text: '系统设计面试：内幕指南 - 目录',
        items: [
          { text: '介绍', link: '/' },
          { text: '前言', link: '/forward' },
          { text: '第1章: 从零扩展到百万用户', link: '/CHAPTER-1-SCALE-FROM-ZERO-TO-MILLIONS-OF-USERS' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design-interview' }
    ]
  }
})
