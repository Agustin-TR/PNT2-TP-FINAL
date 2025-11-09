import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    const selectedMovies = [];

    return {
      token,
      user,
      isAuthenticated: !!token,
      selectedMovies,
    };
  },
  getters: {
    getSelectedMovies: (state) => state.selectedMovies,
  },
  actions: {
    login(userData) {
      this.user = userData;
      this.token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      this.isAuthenticated = true;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.selectedMovies = [];
      localStorage.clear();
      sessionStorage.clear();
    },

    setSelectedMovies(movies) {
      this.selectedMovies = movies;
    },
  },
});
