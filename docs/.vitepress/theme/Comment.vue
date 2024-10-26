<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const observer = ref(null);

onMounted(() => {
  const isDark = document.documentElement.classList.contains("dark");
  
  const config = { attributes: true, attributeFilter: ['class'] };
  observer.value = new window.MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains("dark");
        const iframe = document.getElementById("comments").querySelector("iframe");
        const originSrc = iframe.src;

        if (isDark && originSrc.includes("theme=github-light")) {
          iframe.src = originSrc.replace(/theme=github-(light|dark)/, "theme=github-dark");
        }

        if (!isDark && originSrc.includes("theme=github-dark")) {
          iframe.src = originSrc.replace(/theme=github-(light|dark)/, "theme=github-light");
        }
      }
    }
  });

  observer.value.observe(document.documentElement, config);

  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.setAttribute("repo", "honkinglin/system-design");
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("theme", isDark ? "github-dark" : "github-light");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", "");
  document.getElementById("comments").appendChild(script);
});

onUnmounted(() => {
  observer.value.disconnect();
});
</script>

<template>
  <div id="comments"></div>
</template>
