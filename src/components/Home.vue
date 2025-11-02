<template>
  <h1 class="mb-4 text-center">Popular this week</h1>

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

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Home",
  data() {
    return {
      movies: [],
      watchlist: [],
      favorites: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    watchlistCount() {
      return this.watchlist.length;
    },
  },
  methods: {
    goToWatchlist() {
      this.$router.push("/watchlist");
    },
    toggleFavs(movieId) {
      const index = this.favorites.indexOf(movieId);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(movieId);
      }
    },
    toggleWatchlist(movieId) {
      const index = this.watchlist.indexOf(movieId);
      if (index > -1) {
        this.watchlist.splice(index, 1);
      } else {
        this.watchlist.push(movieId);
      }
    },
    isAdded(movieId) {
      return this.watchlist.includes(movieId);
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
    await this.fetchPopularMovies();
  },
};
</script>

<style scoped>
#btn-favs {
  margin-bottom: 5px;
}
</style>
