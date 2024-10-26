<script setup>
import { onMounted } from "vue";

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
  <div id="comments"></div>
</template>
