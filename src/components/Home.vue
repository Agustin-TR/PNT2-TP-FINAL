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
      class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
    >
      <div
        class="card h-100 shadow-sm movie-card clickable"
        @click="goToDetails(movie.id)"
        style="cursor: pointer"
      >
        <img
          :src="movie.posterUrl"
          class="card-img-top"
          :alt="movie.title"
          loading="lazy"
        />

        <div class="card-body p-2">
          <h6 class="card-title mb-1 text-truncate" :title="movie.title">
            {{ movie.title }}
          </h6>
          <p class="card-text small text-muted">{{ movie.year }}</p>

          <button
            id="btn-favs"
            class="btn btn-sm w-100"
            :class="isFavorite(movie.id) ? 'btn-success' : 'btn-primary'"
            @click.stop="toggleFavs(movie.id)"
          >
            {{ isFavorite(movie.id) ? "❤️" : "+ ♡" }}
          </button>

          <button
            class="btn btn-sm w-100"
            :class="isAdded(movie.id) ? 'btn-success' : 'btn-primary'"
            @click.stop="toggleWatchlist(movie.id)"
          >
            {{ isAdded(movie.id) ? "✅ In Watchlist" : "+ Watchlist" }}
          </button>
        </div>

        <!-- ✅ Checkbox al final -->
        <div class="form-check mt-auto text-center">
          <input
            class="form-check-input position-absolute top-0 end-0 m-2"
            type="checkbox"
            :id="'checkbox-' + movie.id"
            v-model="movie.selected"
            :disabled="isCheckboxDisabled(movie)"
            @click.stop
          />
          </div>

      </div>
    </div>
  </div>

  <div v-else class="alert alert-info text-center" role="alert">
    No popular movies found.
  </div>

  <div class="d-flex justify-content-center mt-3 mb-5">
    <a class="nav-link btn btn-outline-warning" @click.prevent="goToWatchlist">
      My Watchlist ✨ ({{ watchlistCount }})
    </a>
  </div>
</template>

<script>
import movieService from "../services/movies";
import WatchlistService from "../services/watchlist";
import { useAuthStore } from "../stores/authStore";
import { useCompareStore } from "@/stores/compareStore";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Home",

  data() {
    return {
      movies: [],
      // watchlist holds movie IDs as strings, matching your service/db
      watchlist: [],
      favorites: [],
      loading: true,
      error: null,
      authStore: useAuthStore(),
      compareStore: useCompareStore(),
      selectionMax: 3,
    };
  },
  computed: {
    watchlistCount() {
      return this.watchlist.length;
    },
    // Reactive computed property to get the logged-in user's ID
    userId() {
      return this.authStore.user ? this.authStore.user.id : null;
    },
    selectedMovies() {
      return this.movies.filter(m => m.selected);
    },
    isSelectionFull(){
      return this.selectedMovies.length == this.selectionMax
    },
  },
  methods: {
    goToWatchlist() {
      this.$router.push("/watchlist");
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
      if (!this.userId) {
        console.warn("No user ID found. Cannot fetch watchlist.");
        this.watchlist = []; // Ensure the local list is empty if not logged in
        return;
      }

      try {
        // Fetch movie IDs using the logged-in user's ID
        const movieIds = await WatchlistService.getAllWatchlist(this.userId);

        // Ensure movie IDs are consistently strings (as used in toggleWatchlist and isAdded)
        this.watchlist = movieIds.map(String);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    },
    toggleFavs(movieId) {
      const index = this.favorites.indexOf(movieId);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(movieId);
      }
    },

    /**
     * Toggles a movie's presence in the watchlist, persisting the change via the service.
     * @param {number} movieId The ID of the movie to toggle.
     */
    async toggleWatchlist(movieId) {
      const movieIdStr = String(movieId);

      // GUARD RAIL: Prevent action if the user is not logged in
      if (!this.userId) {
        alert("Please log in to add items to your watchlist.");
        return;
      }

      const isCurrentlyAdded = this.watchlist.includes(movieIdStr);

      try {
        if (isCurrentlyAdded) {
          // Remove from watchlist
          // Assuming service returns the updated list (as per your initial service structure)
          const newWatchlist = await WatchlistService.removeFromWatchlist(
            this.userId,
            movieIdStr
          );
          this.watchlist = newWatchlist.map(String);
        } else {
          // Add to watchlist
          await WatchlistService.addToWatchlist(this.userId, movieIdStr);
          // Manually update the local state for immediate visual feedback
          this.watchlist.push(movieIdStr);
        }
      } catch (error) {
        console.error(`Error toggling watchlist for movie ${movieId}:`, error);
        alert(`Could not update watchlist: ${error.message}`);
      }
    },

    isAdded(movieId) {
      // Check for existence using the movie ID cast as a string
      return this.watchlist.includes(String(movieId));
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
  },
};
</script>

<style scoped>
#btn-favs {
  margin-bottom: 5px;
}
</style>
