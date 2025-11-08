import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    selectedMovies: [],
  }),
  getters: {
    getSelectedMovies: state => state.selectedMovies
  },
  actions: {
    login(userData) {
      console.log("Saving user in state:", userData);
      this.isAuthenticated = true;
      this.user = userData;
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },

    setSelectedMovies(movies) {
      this.selectedMovies = movies;
    },
  },
});
