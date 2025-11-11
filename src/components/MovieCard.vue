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

    <div class="card-body p-2">
      <h6 class="card-title mb-1 text-truncate" :title="movie.title">
        {{ movie.title }}
      </h6>
      <p class="card-text small text-muted">{{ movie.year }}</p>

      <button
        id="btn-favs"
        class="btn btn-sm w-100 mb-1"
        :class="isFavorite ? 'btn-success' : 'btn-primary'"
        @click.stop="toggleFavs(movie.id)"
      >
        {{ isFavorite ? "❤️" : "+ ♡" }}
      </button>

      <button
        class="btn btn-sm w-100"
        :class="isAdded ? 'btn-success' : 'btn-primary'"
        @click.stop="toggleWatchlist(movie.id)"
      >
        {{ isAdded ? "✅ In Watchlist" : "+ Watchlist" }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "MovieCard",
  props: {
    movie: { type: Object, required: true },
    isFavorite: { type: Boolean, required: true },
    isAdded: { type: Boolean, required: true },
    toggleFavs: { type: Function, required: true },
    toggleWatchlist: { type: Function, required: true },
  },
};

</script>
