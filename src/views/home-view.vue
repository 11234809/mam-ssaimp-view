<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/images/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/hello-world.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
};
</script>
