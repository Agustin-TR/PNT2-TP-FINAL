<template>
  <div class="container mt-5">
    <h2 class="mb-4">
      <i class="bi bi-star-fill text-warning me-2"></i>My Watchlist
    </h2>

    <div v-if="!isAuthenticated" class="alert alert-danger" role="alert">
      **Error:** You must be logged in to view your watchlist.
    </div>

    <div v-else-if="isLoading" class="alert alert-info" role="alert">
      <div class="spinner-border spinner-border-sm me-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      Loading watchlist...
    </div>

    <div v-else-if="watchlist.length === 0" class="alert alert-secondary" role="alert">
      <i class="bi bi-info-circle-fill me-2"></i>
      Your watchlist is currently **empty**. Add some movies!
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Movie ID</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movieId, index) in watchlist" :key="movieId">
            <th scope="row">{{ index + 1 }}</th>
            <td>**{{ movieId }}**</td>
            <td>
              <button @click="removeItem(movieId)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i> Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// 1. Import the Pinia store and the service
import { useAuthStore } from "@/stores/authStore";
import WatchlistService from "../services/watchlist";

// The BASE_IMAGE_URL is not used here but kept for context
// const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Watchlist",
  data() {
    return {
      watchlist: [], // Renamed from 'pelicula' to 'watchlist' (list of movie IDs)
      isLoading: false, // State for loading visual feedback
    };
  },
  computed: {
    // 2. Get state from the Pinia store
    authStore() {
      return useAuthStore();
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    userId() {
      // Access the user object and return its ID, or null if not logged in
      return this.authStore.user ? this.authStore.user.id : null;
    },
  },
  methods: {
    /**
     * Fetches the user's watchlist from the service.
     */
    async getWatchlist() {
      if (!this.userId) {
        console.error("No user ID found in auth store. Cannot fetch watchlist.");
        return; // Stop if no user is logged in
      }

      this.isLoading = true;
      try {
        // 3. Call the service with the logged-in user's ID
        const movieIds = await WatchlistService.getAllWatchlist(this.userId);
        
        // The service returns the array of movie IDs: [507244, 338969, 1218925]
        this.watchlist = movieIds;
        
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        // You could add a user-facing error message here
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Placeholder method for removing an item.
     */
    async removeItem(movieId) {
      if (!confirm(`Are you sure you want to remove movie ID ${movieId} from your watchlist?`)) {
        return;
      }
      try {
          // This calls your service's removal logic
          const newWatchlist = await WatchlistService.removeFromWatchlist(this.userId, movieId);
          this.watchlist = newWatchlist; // Update the local state
          console.log(`Movie ID ${movieId} removed.`);
      } catch (error) {
          alert("Error removing item: " + error.message);
      }
    }
  },
  mounted() {
    // 4. Call the fetch method when the component is mounted
    this.getWatchlist();
  },
  // We can use a watcher to re-fetch if the user logs in/out while the component is mounted
  watch: {
    userId(newId, oldId) {
      if (newId !== oldId && newId !== null) {
        this.getWatchlist();
      } else if (newId === null) {
        this.watchlist = []; // Clear watchlist on logout
      }
    },
  },
};
</script>

<style scoped>
/* Scoped styles for this component */
</style>