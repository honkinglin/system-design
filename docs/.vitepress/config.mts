import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "系统设计面试：内幕指南",
  description: "《System Design Interview: An Insider’s Guide》 中文翻译",
  base: '/system-design-interview',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    sidebar: [
      {
        text: '系统设计面试：内幕指南 - 目录',
        items: [
          { text: '介绍', link: '/' },
          { text: '前言', link: '/forward' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design-interview' }
    ]
  }
})
