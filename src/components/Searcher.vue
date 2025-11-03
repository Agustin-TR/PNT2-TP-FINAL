<template>
  <div class="reactive-searcher dropdown me-3" :class="{ show: showDropdown }">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        placeholder="Star Wars"
        v-model="searchText"
        @input="debouncedSearch"
        @focus="showDropdown = true"
        @blur="hideDropdown"
      />
      <span
        class="input-group-text search-icon"
        @click="goToFirstResult"
        style="cursor: pointer"
      >
        <i class="bi bi-search"></i>
      </span>
    </div>

    <ul
      class="dropdown-menu"
      :class="{ show: showDropdown }"
      @mousedown.prevent
    >
      <li v-if="loading" class="dropdown-item text-center">
        <Spinner />
      </li>

      <li v-else-if="results.length" v-for="movie in results" :key="movie.id">
        <a
          class="dropdown-item d-flex align-items-center"
          href="#"
          @click.prevent="goToDetails(movie.id)"
        >
          <img :src="movie.posterUrl" alt="Poster" class="poster-small me-2" />
          <span class="text-truncate"
            >{{ movie.title }} ({{ movie.year }})</span
          >
        </a>
      </li>

      <li
        v-else-if="searchText && !loading && searchText.length >= 3"
        class="dropdown-item text-muted"
      >
        There are no results for "{{ searchText }}".
      </li>

      <li v-else class="dropdown-item text-muted">
        Please enter at least 3 characters
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import MovieService from "../services/movies";
import Spinner from "./Spinner.vue";
const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Searcher",
  components: {
    Spinner,
  },
  data() {
    return {
      searchText: "",
      results: [],
      loading: false,
      showDropdown: false,
    };
  },
  created() {
    this.debouncedSearch = debounce(this.fetchResults, 300);
  },
  methods: {
    async fetchResults() {
      const query = this.searchText.trim();

      if (query.length < 3) {
        this.results = [];
        this.showDropdown = query.length > 0;
        return;
      }

      this.loading = true;
      this.showDropdown = true;

      try {
        // Call the searchMovies method from movies.js
        const data = await MovieService.searchMovies(query);

        // Map and limit the results for the dropdown (max 7)
        this.results = data
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A",
            posterUrl: movie.poster_path
              ? `${BASE_IMAGE_URL}${movie.poster_path}`
              : "https://via.placeholder.com/92x138/333/FFFFFF?text=NP",
          }))
          .slice(0, 7);
      } catch (error) {
        console.error("Error searching:", error);
        this.results = [];
      } finally {
        this.loading = false;
      }
    },

    goToDetails(movieId) {
      this.$router.push({ name: "Movie", params: { id: movieId } });

      this.searchText = "";
      this.results = [];
      this.showDropdown = false;
    },

    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 150);
    },
  },
};
</script>

<style scoped>
.reactive-searcher {
  position: relative;
  width: 100%;
}

@media screen and (min-width: 768px) {
  .reactive-searcher {
    max-width: 600px;
  }
}

.input-group {
  border-radius: 2px;
  overflow: hidden;
}

.form-control {
  border: none;
  box-shadow: none;
  padding-right: 0.5rem;
}

.input-group-text {
  background-color: white;
  border: none;
  color: #495057;
  padding-left: 0.5rem;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  z-index: 1050;
  max-height: 600px;
  overflow-y: auto;
  display: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-menu.show {
  display: block;
}

.poster-small {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 3px;
}

.dropdown-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-item:hover {
  background-color: #495057b0;
}
.dropdown-item:active {
  background-color: #0d6efd;
  color: white;
}
</style>
