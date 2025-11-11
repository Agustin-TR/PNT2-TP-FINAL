import { defineStore } from "pinia";

export const useCompareStore = defineStore("compareStore", {
  state: () => {
     const selectedMovies = [];

    return {
      selectedMovies,
    };
  },
  getters: {
    getSelectedMovies: (state) => state.selectedMovies,
  },
  actions: {
    setSelectedMovies(movies) {
      this.selectedMovies = movies;
    },
  },
});
