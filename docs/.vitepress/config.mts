import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "系统设计面试：内幕指南",
  description: "《System Design Interview: An Insider’s Guide》 中文翻译",
  base: '/system-design',
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    
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
          { text: '第4章: 设计一个限流器', link: '/CHAPTER-4-DESIGN-A-RATE-LIMITER' },
          { text: '第5章: 设计一致性哈希', link: '/CHAPTER-5-DESIGN-CONSISTENT-HASHING' },
          { text: '第6章：设计一个键值存储', link: '/CHAPTER-6-DESIGN-A-KEY-VALUE-STORE' },
          { text: '第7章：设计一个分布式系统中的唯一 ID 生成器', link: '/CHAPTER-7-DESIGN-A-UNIQUE-ID-GENERATOR-IN-DISTRIBUTED-SYSTEMS' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design-interview' }
    ]
  }
})
