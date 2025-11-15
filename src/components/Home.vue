<template>
  <h1 class="mb-4 text-center">Popular this week</h1>

  <div class="d-flex justify-content-end mb-3">
    <button v-show="isSelectionFull"
      class="btn btn-lg btn-primary mt-3"
      @click="goToCompare()"
    >
      Compare
    </button>
  </div>

  <div v-if="loading" class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="error" class="alert alert-danger text-center" role="alert">
    Error loading movies: {{ error }}
  </div>

  <div v-else-if="movies.length" class="row">
    <div
      v-for="movie in movies"
      :key="movie.id"
      class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"
    >
      <MovieCard
        :movie="movie"
        :isAuthenticated="isAuthenticated"
        :isAdded="isAdded"
        :isCheckboxDisabled="isCheckboxDisabled"
        :toggleWatchlist="toggleWatchlist"
        :toggleFavs="toggleFavs"
        :favoritesStore="favoritesStore"
        :goToDetails="goToDetails"
      />
    </div>
  </div>

  <div v-else class="alert alert-info text-center" role="alert">
    No popular movies found.
  </div>

    <div class="d-flex justify-content-center mt-3 mb-5">
    <button
        v-show="isAuthenticated"
        class="btn btn-outline-dark"
        @click.stop="goToWatchlist"
        >
        My Watchlist ✨ ({{ watchlistCount }})
    </button>
</div>
</template>

<script>
import movieService from "../services/movies";
import WatchlistService from "../services/watchlist";
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useCompareStore } from "@/stores/compareStore";
import MovieCard from "./MovieCard.vue";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Home",
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [],
      // watchlist holds movie IDs as strings, matching your service/db
      watchlist: [],
      favorites: [],
      favoritesStore: useFavoritesStore(),
      loading: true,
      error: null,
      authStore: useAuthStore(),
      compareStore: useCompareStore(),
      selectionMax: 3,
    };
  },

  computed: {
    watchlistCount() {
      return this.authStore.user?.watchlist?.length || 0;
    },
    ...mapState(useAuthStore, ["isAuthenticated", "user"]),
    // Reactive computed property to get the logged-in user's ID
    userId() {
      return this.authStore.user ? this.authStore.user.id : null;
    },
    favoritesStore(){
      return useFavoritesStore();
    },
    selectedMovies() {
      return this.movies.filter(m => m.selected);
    },
    isSelectionFull(){
      return this.selectedMovies.length == this.selectionMax
    },
    isFavoriteMovie() {
      return (movieId) => this.favoritesStore.isFavorite(movieId);
    }
  },

  methods: {
    goToWatchlist() {
      if (!this.authStore.isAuthenticated) {
        alert("No user ID found. Cannot fetch watchlist.");
        this.watchlist = [];
        return;
      } else {
        this.$router.push("/watchlist");
      }
    },
    //checkbox
    isCheckboxDisabled(movie) {
    return this.isSelectionFull && !movie.selected;
    },
    goToCompare(){
      this.compareStore.setSelectedMovies(this.selectedMovies);
      this.$router.push({ path: '/compare' });
    },
    /**
     * Fetches the user's current watchlist from the service.
     */
    async getWatchlist() {
      // GUARD RAIL: Check for user ID
      if (!this.authStore.isAuthenticated) {
        console.warn("No user ID found. Cannot fetch watchlist.");
        this.watchlist = []; // Ensure the local list is empty if not logged in
        return;
      }

      try {
        // Fetch movie IDs using the logged-in user's ID
        const movieIds = await WatchlistService.getAllWatchlist();

        // Ensure movie IDs are consistently strings (as used in toggleWatchlist and isAdded)
        this.watchlist = movieIds.map(String);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    },

    async toggleFavs(movieId) {
      if (!this.userId) {
        alert("Please log in to add items to your favorites.");
        return;
      }
      try {
        //el store llama al servicio internamente
        await this.favoritesStore.toggleFavorite(this.userId, movieId);
      } catch (err) {
        alert(`Could not update favorites: ${err.message}`);
      }
    },

    /**
     * Toggles a movie's presence in the watchlist, persisting the change via the service.
     * @param {number} movieId The ID of the movie to toggle.
     */
    async toggleWatchlist(movieId) {
      const movieIdStr = String(movieId);

      // GUARD RAIL: Prevent action if the user is not logged in
      if (!this.authStore.isAuthenticated) {
        alert("Please log in to add items to your watchlist.");
        return;
      }

      const isCurrentlyAdded = WatchlistService.isInWatchlist(movieIdStr);

      try {
        if (isCurrentlyAdded) {
          // Remove from watchlist
          const newWatchlist = await WatchlistService.removeFromWatchlist(
            movieIdStr
          );

          this.watchlist = newWatchlist.map(String);
        } else {
          // Add to watchlist
          await WatchlistService.addToWatchlist(movieIdStr);
          // Manually update the local state for immediate visual feedback
          //this.watchlist.push(movieIdStr);
        }
      } catch (error) {
        console.error(`Error toggling watchlist for movie ${movieId}:`, error);
        alert(`Could not update watchlist: ${error.message}`);
      }
    },

    isAdded(movieId) {
      // Check for existence using the movie ID cast as a string
      return WatchlistService.isInWatchlist(String(movieId));
    },
     isFavorite(movieId) {
      return this.favorites.includes(movieId);
    },
    goToDetails(movieId) {
      this.$router.push({ name: "Movie", params: { id: movieId } });
    },
    async fetchPopularMovies() {
      this.loading = true;
      this.error = null;
      try {
        const results = await movieService.getPopularMovies();

        this.movies = results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A",
          posterUrl: movie.poster_path
            ? `${BASE_IMAGE_URL}${movie.poster_path}`
            : "https://via.placeholder.com/150x225/333/FFFFFF?text=No+Poster",
        }));
      } catch (err) {
        console.error("Error loading popular movies:", err);
        this.error = "Could not load movies. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    // 1. Fetch popular movies first
    await this.fetchPopularMovies();

    // 2. Fetch the user's watchlist immediately after.
    // This populates the watchlist array and sets the initial state for isAdded().
    await this.getWatchlist();

    //cargar favs una vez
    if (this.userId) {
      await this.favoritesStore.loadFavorites(this.userId);
    }
  },
};
</script>

<style scoped>
#btn-favs {
  margin-bottom: 5px;
}
</style>