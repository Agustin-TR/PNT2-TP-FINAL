<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-lg">
      <RouterLink class="navbar-brand pelli-logo" to="/">Pelli</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li class="nav-item me-lg-2">
            <Searcher />
          </li>

          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/signup">Sign Up</RouterLink>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">
                Hi, {{ user.name || "User" }}
              </RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout"
                >Logout</a
              >
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
.nav-link {
  cursor: pointer;
}
</style>
