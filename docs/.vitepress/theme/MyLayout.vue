<script setup>
import DefaultTheme from "vitepress/theme";
import { onMounted } from "vue";

const { Layout } = DefaultTheme;

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.setAttribute("repo", "honkinglin/system-design");
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("theme", "github-light");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", "");
  document.getElementById("comments").appendChild(script);
});
</script>

<template>
  <Layout>
    <template #doc-after>
      <div id="comments"></div>
    </template>
  </Layout>
</template>
