<template>
  <h1 class="mb-4 text-center">Popular this week</h1>

  <button
    :disabled="!isSelectionFull()"
    class="btn btn-lg btn-primary mt-3 ms-auto d-block mb-3"
    @click="goToCompare"
  >
    Compare
  </button>

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
        :isFavorite="isFavorite(movie.id)"
        :isAdded="isAdded(movie.id)"
        @toggleFav="toggleFavs"
        @toggleWatchlist="toggleWatchlist"
        @goToDetails="goToDetails"
      />
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
import MovieCard from "../components/MovieCard.vue";
import movieService from "../services/movies";
import WatchlistService from "../services/watchlist";
import { useAuthStore } from "../stores/authStore";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Home",
  components: { MovieCard },

  data() {
    return {
      movies: [],
      watchlist: [],
      favorites: [],
      loading: true,
      error: null,
      authStore: useAuthStore(),
      selectedMovies: [],
      selectedCount: 0,
      selectionMax: 3,
    };
  },

  computed: {
    watchlistCount() {
      return this.watchlist.length;
    },
    userId() {
      return this.authStore.user?.id ?? null;
    },
  },

  methods: {
    goToWatchlist() {
      this.$router.push("/watchlist");
    },

    async fetchPopularMovies() {
      this.loading = true;
      try {
        const results = await movieService.getPopularMovies();
        this.movies = results.map((m) => ({
          id: m.id,
          title: m.title,
          year: m.release_date
            ? new Date(m.release_date).getFullYear()
            : "N/A",
          posterUrl: m.poster_path
            ? `${BASE_IMAGE_URL}${m.poster_path}`
            : "https://via.placeholder.com/150x225/333/FFFFFF?text=No+Poster",
        }));
      } catch (err) {
        this.error = "Could not load movies. Please try again later.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async getWatchlist() {
      if (!this.userId) return;
      try {
        const ids = await WatchlistService.getAllWatchlist(this.userId);
        this.watchlist = ids.map(String);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    },

    toggleFavs(movieId) {
      const i = this.favorites.indexOf(movieId);
      i > -1 ? this.favorites.splice(i, 1) : this.favorites.push(movieId);
    },

    async toggleWatchlist(movieId) {
      const id = String(movieId);
      if (!this.userId) return alert("Please log in first.");

      const isAdded = this.watchlist.includes(id);
      try {
        if (isAdded) {
          const newList = await WatchlistService.removeFromWatchlist(
            this.userId,
            id
          );
          this.watchlist = newList.map(String);
        } else {
          await WatchlistService.addToWatchlist(this.userId, id);
          this.watchlist.push(id);
        }
      } catch (err) {
        console.error(`Error updating watchlist:`, err);
        alert(`Could not update watchlist: ${err.message}`);
      }
    },

    isAdded(id) {
      return this.watchlist.includes(String(id));
    },

    isFavorite(id) {
      return this.favorites.includes(id);
    },

    goToDetails(id) {
      this.$router.push({ name: "Movie", params: { id } });
    },
  },

  async mounted() {
    await this.fetchPopularMovies();
    await this.getWatchlist();
  },
};
</script>
