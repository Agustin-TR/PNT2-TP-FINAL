<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center my-5">
      <Spinner />
    </div>

    <div
      v-else-if="error"
      class="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-4 mt-5"
    >
      <div class="text-center text-lg-start">
        <h1 class="title">
          Houston, we have a
          <span class="text-danger text-decoration-underline">problem</span>
        </h1>

        <p class="fs-4 fw-semibold">
          There was an error loading the movie details.
        </p>

        <p class="fs-5 text-muted mb-4">
          {{ error }}
        </p>

        <button
          class="btn btn-outline-danger btn-lg rounded-pill px-4"
          @click="fetchMovieDetails"
        >
          Retry
        </button>
      </div>

      <img
        src="../assets/movie-not-found.svg"
        class="img-fluid"
        alt="Movie not found"
      />
    </div>

    <div v-else-if="movie" class="row">
      <div class="col-md-4 mb-4">
        <img
          :src="posterUrl"
          class="img-fluid rounded shadow-lg"
          :alt="movie.title"
        />
      </div>
      <div class="col-md-8">
        <h1 class="display-4">{{ movie.title }} ({{ releaseYear }})</h1>
        <p class="lead text-muted">{{ movie.tagline }}</p>

        <hr />

        <p>
          Score:
          <span class="badge bg-warning text-dark">{{
            movie.vote_average.toFixed(1)
          }}</span>
          / 10 ({{ movie.vote_count }} votes)
        </p>

        <p>
          Genres:
          <span
            v-for="genre in movie.genres"
            :key="genre.id"
            class="badge bg-secondary me-2"
          >
            {{ genre.name }}
          </span>
        </p>

        <p>Runtime: {{ movie.runtime }} minutes</p>

        <h2 class="mt-4">Synopsis</h2>
        <p>{{ movie.overview }}</p>

        <button
          class="btn btn-lg btn-outline-primary mt-3"
          @click="$router.go(-1)"
        >
          ← Back
        </button>
      </div>
    </div>

    <div v-else class="alert alert-info text-center">
      No movie found with ID {{ $route.params.id }}.
    </div>
  </div>
</template>

<script>
import Spinner from "./Spinner.vue";

import movieService from "../services/movies";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Movie",
  components: {
    Spinner,
  },
  props: ["id"],
  data() {
    return {
      movie: null,
      loading: true,
      error: null,
    };
  },
  computed: {
    releaseYear() {
      return this.movie?.release_date
        ? new Date(this.movie.release_date).getFullYear()
        : "N/A";
    },
    posterUrl() {
      return this.movie?.poster_path
        ? `${BASE_IMAGE_URL}${this.movie.poster_path}`
        : "https://via.placeholder.com/500x750/333/FFFFFF?text=Sin+Poster";
    },
  },
  methods: {
    async fetchMovieDetails() {
      this.loading = true;
      this.error = null;
      // El ID de la película se obtiene de la ruta (this.$route.params.id) o del prop 'id'
      const movieId = this.id || this.$route.params.id;

      if (!movieId) {
        this.error = "ID de película no proporcionado.";
        this.loading = false;
        return;
      }

      try {
        this.movie = await movieService.getMovieDetails(movieId);
      } catch (err) {
        console.error("Could not fetch movie details:", err);
        this.error = "Could not load movie details.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchMovieDetails();
  },
};
</script>

<style scoped>
.rounded {
  border-radius: 0.5rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
}

img {
  width: 100%;
}

@media (min-width: 992px) {
  .title {
    font-size: 4.5rem;
  }
  img {
    width: 50%;
  }
}
</style>
