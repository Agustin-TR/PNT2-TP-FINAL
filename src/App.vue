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

<style scoped>
body {
  margin: 0;
  padding: 0;
}

@font-face {
    font-family: 'Pelli';
    src: url('./assets/fonts/Playfair/static/Playfair_144pt-Regular.ttf') format('truetype');
}

.pelli-logo {
    font-family: 'Pelli';
}
</style>
