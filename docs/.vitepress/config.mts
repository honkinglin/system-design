import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "系统设计面试：内幕指南",
  description: "《System Design Interview: An Insider’s Guide》 中文翻译",
  base: '/system-design',
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
          { text: '第2章: 粗略估算', link: '/CHAPTER-2-BACK-OF-THE-ENVELOPE-ESTIMATION' },
          { text: '第3章: 系统设计面试框架', link: '/CHAPTER-3-A-FRAMEWORK-FOR-SYSTEM-DESIGN-INTERVIEWS' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design-interview' }
    ]
  }
})
