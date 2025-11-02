<template>
  <Navbar />
 <main class="container-lg mt-4">
   <RouterView />
 </main>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar,
  },
};
</script>
