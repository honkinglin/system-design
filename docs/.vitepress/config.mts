import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "System Design",
  description: "《System Design Interview: An Insider’s Guide》 中文翻译",
  base: '/system-design',
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',

    nav: [
      {
        text: '📚 系统设计书籍',
        items: [
          { text: '《系统设计面试：内幕指南》', link: '/system-design-interview' },
        ]
      }
    ],
    
    search: {
      provider: 'local'
    },

    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/honkinglin/system-design/edit/main/docs/:path'
    },

    sidebar: {
      '/system-design-interview/': [
        {
          text: '系统设计面试：内幕指南',
          items: [
            { text: '介绍', link: '/system-design-interview' },
            { text: '前言', link: '/system-design-interview/FORWARD' },
            { text: '第一章：从零扩展到百万用户', link: '/system-design-interview/CHAPTER-1-SCALE-FROM-ZERO-TO-MILLIONS-OF-USERS' },
            { text: '第二章：粗略估算', link: '/system-design-interview/CHAPTER-2-BACK-OF-THE-ENVELOPE-ESTIMATION' },
            { text: '第三章：系统设计面试框架', link: '/system-design-interview/CHAPTER-3-A-FRAMEWORK-FOR-SYSTEM-DESIGN-INTERVIEWS' },
            { text: '第四章：设计一个限流器', link: '/system-design-interview/CHAPTER-4-DESIGN-A-RATE-LIMITER' },
            { text: '第五章：设计一致性哈希', link: '/system-design-interview/CHAPTER-5-DESIGN-CONSISTENT-HASHING' },
            { text: '第六章：设计一个键值存储', link: '/system-design-interview/CHAPTER-6-DESIGN-A-KEY-VALUE-STORE' },
            { text: '第七章：设计一个分布式系统中的唯一 ID 生成器', link: '/system-design-interview/CHAPTER-7-DESIGN-A-UNIQUE-ID-GENERATOR-IN-DISTRIBUTED-SYSTEMS' },
            { text: '第八章：设计一个 URL 缩短服务', link: '/system-design-interview/CHAPTER-8-DESIGN-A-URL-SHORTENER' },
            { text: '第九章：设计一个网页爬虫', link: '/system-design-interview/CHAPTER-9-DESIGN-A-WEB-CRAWLER' },
            { text: '第十章：设计一个通知系统', link: '/system-design-interview/CHAPTER-10-DESIGN-A-NOTIFICATION-SYSTEM' },
            { text: '第十一章：设计一个新闻订阅系统', link: '/system-design-interview/CHAPTER-11-DESIGN-A-NEWS-FEED-SYSTEM' },
            { text: '第十二章：设计一个聊天系统', link: '/system-design-interview/CHAPTER-12-DESIGN-A-CHAT-SYSTEM' },
            { text: '第十三章：设计搜索自动完成系统', link: '/system-design-interview/CHAPTER-13-DESIGN-A-SEARCH-AUTOCOMPLETE-SYSTEM' },
            { text: '第十四章：设计 YouTube', link: '/system-design-interview/CHAPTER-14-DESIGN-YOUTUBE' },
            { text: '第十五章：设计 Google Drive', link: '/system-design-interview/CHAPTER-15-DESIGN-GOOGLE-DRIVE' },
            { text: '第十六章：学习永无止境', link: '/system-design-interview/CHAPTER-16-THE-LEARNING-CONTINUES' },
            { text: '后记', link: '/system-design-interview/AFTERWORD' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design' }
    ]
  }
})
