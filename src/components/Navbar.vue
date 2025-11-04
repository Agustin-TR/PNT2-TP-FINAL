<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4 py-2 sticky-top">
    <div class="container-fluid d-flex align-items-center flex-nowrap p-0">

      <RouterLink class="navbar-brand pelli-logo fs-3 fw-bold text-warning px-3 me-0 flex-shrink-0" to="/">Peli</RouterLink>

      <div class="searcher-wrapper flex-grow-1 mx-2">
        <Searcher />
      </div>

      <button class="navbar-toggler me-2" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse flex-grow-0" id="collapsibleNavbar">

        <ul class="navbar-nav ms-auto flex-md-row flex-column align-items-md-center align-items-start px-4">

          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link text-nowrap text-white me-2" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-nowrap text-white me-2" to="/signup">Sign Up</RouterLink>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <a class="nav-link text-nowrap text-white me-2" to="#">Hi, {{ user?.firstName || "User" }}</a>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-nowrap text-white me-2" to="/favorites">Favorites</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-nowrap text-white me-2" to="/watchlist">Watchlist</RouterLink>
            </li>
            <li class="nav-item">
            <a class="nav-link text-nowrap text-white me-2" href="#" @click.prevent="handleLogout">Logout</a>
            </li>
            
          </template>

        </ul>
      </div>

    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import Searcher from "./Searcher.vue";

export default {
  components: {
    Searcher,
  },
  name: "Navbar",
  computed: {
    ...mapState(useAuthStore, ["isAuthenticated", "user"]),
  },
  methods: {
    ...mapActions(useAuthStore, { storeLogout: "logout" }),

    handleLogout() {
      this.storeLogout();

      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
</style>