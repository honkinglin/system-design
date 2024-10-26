import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Comment from './Comment.vue'

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Comment)
    })
  }
}
