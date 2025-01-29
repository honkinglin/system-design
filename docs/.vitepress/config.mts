import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "System Design",
  description: "System Design 面试指南",
  base: '/system-design',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', href: '/system-design/favicon.ico' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',

    nav: [
      {
        text: 'System Design 书籍',
        items: [
          { text: 'System Design Interview: An Insider’s Guide', link: '/insider' },
          { text: 'Grokking-the-system-design-interview', link: '/grokking' },
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
      '/insider/': [
        {
          text: '系统设计面试：内幕指南',
          link: '/insider/index',
          items: [
            { text: '前言', link: '/insider/FORWARD' },
            { text: '第一章：从零扩展到百万用户', link: '/insider/CHAPTER-1-SCALE-FROM-ZERO-TO-MILLIONS-OF-USERS' },
            { text: '第二章：粗略估算', link: '/insider/CHAPTER-2-BACK-OF-THE-ENVELOPE-ESTIMATION' },
            { text: '第三章：系统设计面试框架', link: '/insider/CHAPTER-3-A-FRAMEWORK-FOR-SYSTEM-DESIGN-INTERVIEWS' },
            { text: '第四章：设计一个限流器', link: '/insider/CHAPTER-4-DESIGN-A-RATE-LIMITER' },
            { text: '第五章：设计一致性哈希', link: '/insider/CHAPTER-5-DESIGN-CONSISTENT-HASHING' },
            { text: '第六章：设计一个键值存储', link: '/insider/CHAPTER-6-DESIGN-A-KEY-VALUE-STORE' },
            { text: '第七章：设计一个分布式系统中的唯一 ID 生成器', link: '/insider/CHAPTER-7-DESIGN-A-UNIQUE-ID-GENERATOR-IN-DISTRIBUTED-SYSTEMS' },
            { text: '第八章：设计一个 URL 缩短服务', link: '/insider/CHAPTER-8-DESIGN-A-URL-SHORTENER' },
            { text: '第九章：设计一个网页爬虫', link: '/insider/CHAPTER-9-DESIGN-A-WEB-CRAWLER' },
            { text: '第十章：设计一个通知系统', link: '/insider/CHAPTER-10-DESIGN-A-NOTIFICATION-SYSTEM' },
            { text: '第十一章：设计一个新闻订阅系统', link: '/insider/CHAPTER-11-DESIGN-A-NEWS-FEED-SYSTEM' },
            { text: '第十二章：设计一个聊天系统', link: '/insider/CHAPTER-12-DESIGN-A-CHAT-SYSTEM' },
            { text: '第十三章：设计搜索自动完成系统', link: '/insider/CHAPTER-13-DESIGN-A-SEARCH-AUTOCOMPLETE-SYSTEM' },
            { text: '第十四章：设计 YouTube', link: '/insider/CHAPTER-14-DESIGN-YOUTUBE' },
            { text: '第十五章：设计 Google Drive', link: '/insider/CHAPTER-15-DESIGN-GOOGLE-DRIVE' },
            { text: '第十六章：学习永无止境', link: '/insider/CHAPTER-16-THE-LEARNING-CONTINUES' },
            { text: '后记', link: '/insider/AFTERWORD' },
          ]
        }
      ],
      '/grokking/': [
        {
          text: '深入理解系统设计面试',
          link: '/grokking/index',
          items: [
            { text: "系统设计面试：循序渐进指南", link: "/grokking/chapter-1" },
          ]
        },
        {
          text: '系统设计问题',
          items: [
            { "text": "设计 URL 缩短服务，例如 TinyURL", "link": "/grokking/chapter-2" },
            { "text": "设计 Pastebin", "link": "/grokking/chapter-3" },
            { "text": "设计 Instagram", "link": "/grokking/chapter-4" },
            { "text": "设计 Dropbox", "link": "/grokking/chapter-5" },
            { "text": "设计 Facebook Messenger", "link": "/grokking/chapter-6" },
            { "text": "设计 Twitter", "link": "/grokking/chapter-7" },
            { "text": "设计 YouTube 或 Netflix", "link": "/grokking/chapter-8" },
            { "text": "设计自动完成建议", "link": "/grokking/chapter-9" },
            { "text": "设计 API 速率限制器", "link": "/grokking/chapter-10" },
            { "text": "设计 Twitter 搜索", "link": "/grokking/chapter-11" },
            { "text": "设计网络爬虫", "link": "/grokking/chapter-12" },
            { "text": "设计 Facebook 的新闻订阅", "link": "/grokking/chapter-13" },
            // { "text": "设计 Yelp 或附近的朋友", "link": "/grokking/chapter-14" },
            // { "text": "设计 Uber 后端", "link": "/grokking/chapter-15" },
            // { "text": "设计 Ticketmaster", "link": "/grokking/chapter-16" },
            // { "text": "其他资源", "link": "/grokking/chapter-17" },
          ]
        },
        // {
        //   text: '系统设计基础',
        //   items: [
        //     { "text": "分布式系统的关键特性", "link": "/grokking/chapter-18" },
        //     { "text": "负载均衡", "link": "/grokking/chapter-19" },
        //     { "text": "缓存", "link": "/grokking/chapter-20" },
        //     { "text": "分片或数据分区", "link": "/grokking/chapter-21" },
        //     { "text": "索引", "link": "/grokking/chapter-22" },
        //     { "text": "代理", "link": "/grokking/chapter-23" },
        //     { "text": "冗余与复制", "link": "/grokking/chapter-24" },
        //     { "text": "SQL 与 NoSQL", "link": "/grokking/chapter-25" },
        //     { "text": "CAP 定理", "link": "/grokking/chapter-26" },
        //     { "text": "一致性哈希", "link": "/grokking/chapter-27" },
        //     { "text": "长轮询 vs WebSockets vs 服务器发送事件", "link": "/grokking/chapter-28" }
        //   ]
        // }
      ]    
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honkinglin/system-design' }
    ]
  }
})
