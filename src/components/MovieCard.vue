<template>
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

    <div class="card-body p-2 text-center">
      <h6 class="card-title mb-1" style="height: 60px" :title="movie.title">
        {{ movie.title }}
      </h6>
      <p class="card-text small text-muted">{{ movie.year }}</p>

      <button
        id="btn-favs"
        v-show="isAuthenticated"
        class="btn btn-sm w-100 mb-2"
        :class="
          favoritesStore.isFavorite(movie.id) ? 'btn-success' : 'btn-primary'
        "
        @click.stop="toggleFavs(movie.id)"
      >
        {{ favoritesStore.isFavorite(movie.id) ? "❤️" : "+ ♡" }}
      </button>

      <button
        class="btn btn-sm w-100"
        :class="isAdded(movie.id) ? 'btn-success' : 'btn-primary'"
        @click.stop="toggleWatchlist(movie.id)"
        v-if="isAuthenticated"
      >
        {{ isAdded(movie.id) ? "✅ In Watchlist" : "+ Watchlist" }}
      </button>
    </div>
    <div class="form-check mt-auto text-center">
      <input
        class="form-check-input position-absolute top-0 end-0 m-2"
        type="checkbox"
        :id="'checkbox-' + movie.id"
        v-model="movie.selected"
        @change="isSelectionFull()"
        :disabled="isCheckboxDisabled(movie)"
        @click.stop
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "MovieCard",

  props: {
    movie: {
      type: Object,
      required: true,
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    isAdded: {
      type: Function,
      required: true,
    },
    isCheckboxDisabled: {
      type: Function,
      required: true,
    },
    toggleWatchlist: {
      type: Function,
      required: true,
    },
    toggleFavs: {
      type: Function,
      required: true,
    },
    favoritesStore: {
      type: Object,
      required: true,
    },
    goToDetails: {
      type: Function,
      required: true,
    },
  },
};
</script>
