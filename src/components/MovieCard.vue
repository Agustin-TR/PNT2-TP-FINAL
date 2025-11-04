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
  data() {
    return {
      isFavorite: false,
      isAdded: false,
    };
  },
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },

  methods: {
    toggleFavs() {
      alert(`Toggling favorite for movie ID: ${this.movie.id}`);
    },
    goToDetails(movieId) {
      this.$router.push({ name: "Movie", params: { id: movieId } });
    },
    /**
     * Toggles a movie's presence in the watchlist, persisting the change via the service.
     * @param {number} movieId The ID of the movie to toggle.
     */
    async toggleWatchlist(movieId) {
      alert(`Toggling watchlist for movie ID: ${movieId}`);
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
  },
};
</script>
