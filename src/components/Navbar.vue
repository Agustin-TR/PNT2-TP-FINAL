<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-lg d-flex flex-column align-items-center">
      <div class="d-flex justify-content-between align-items-center w-100">
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
          <ul class="navbar-nav ms-auto mb-lg-0 align-items-center">
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
                <RouterLink class="nav-link" to="/films">Films</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/lists">Lists</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/favorites"
                  >Favorites</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/profile">
                  Hi, {{ user?.firstName || "User" }}
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

      <Searcher />
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
    // Tu código ya era correcto. mapState puede traer tanto 'state' como 'getters'.
    // Asumiendo que 'isAuthenticated' es un getter y 'user' es state, esto funciona.
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