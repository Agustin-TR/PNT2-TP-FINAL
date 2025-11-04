<template>
  <div class="container mt-5">
    <h2 class="mb-4">
      <i class="bi bi-star-fill text-warning me-2"></i>📺 My Watchlist
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

    <div v-else-if="sortedWatchlist.length === 0" class="alert alert-secondary" role="alert">
      <i class="bi bi-info-circle-fill me-2"></i>
      Your watchlist is currently **empty**. Add some movies!
    </div>

    <div v-else class="table-responsive">
    <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
        <tr>
            <th scope="col">#</th>
            <th scope="col" @click="sortBy('title')" class="sortable">
            <div class="d-flex align-items-center justify-content-between">
                Title
                <i :class="getSortIcon('title')"></i>
            </div>
            </th>
            <th scope="col">Tagline</th>
            <th scope="col" @click="sortBy('vote_average')" class="sortable text-center">
            <div class="d-flex align-items-center justify-content-center">
                Rating
                <i :class="getSortIcon('vote_average')"></i>
            </div>
            </th>
            <th scope="col" @click="sortBy('release_date')" class="sortable text-nowrap">
            <div class="d-flex align-items-center justify-content-start">
                Release Date
                <i :class="getSortIcon('release_date')"></i>
            </div>
            </th>
            <th scope="col" @click="sortBy('runtime')" class="sortable text-center">
            <div class="d-flex align-items-center justify-content-center">
                Runtime
                <i :class="getSortIcon('runtime')"></i>
            </div>
            </th>
            <th scope="col">Genres</th>
            <th scope="col" class="text-center">Poster</th>
            <th scope="col" class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(movie, index) in sortedWatchlist" :key="movie.id">
            <th scope="row">{{ index + 1 }}</th>
            <td><strong>{{ movie.title }}</strong></td> 
            <td class="text-muted small">{{ movie.tagline || 'N/A' }}</td>
            <td class="text-center">
            <span class="badge bg-warning text-dark">{{ formatRating(movie.vote_average) }}</span>
            </td>
            <td>{{ formatDate(movie.release_date) }}</td>
            <td class="text-center">{{ movie.runtime }} min</td>
            <td>{{ formatGenres(movie.genres) }}</td>
            
            <td class="text-center">
            <img
                :src="getPosterUrl(movie.poster_path)"
                :alt="`Poster for ${movie.title}`"
                class="poster-thumbnail"
                @click="showPosterModal(movie.poster_path)"
                loading="lazy"
            />
            </td>
            <td class="text-center text-nowrap">
            <button 
                @click="toggleFavorite(movie.id)" 
                :class="['btn', 'btn-sm', 'me-2', isFavorite(movie.id) ? 'btn-warning' : 'btn-outline-warning']"
                :title="isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'"
            >
                <i :class="isFavorite(movie.id) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
            </button>
            
            <button @click="removeItem(movie.id)" class="btn btn-sm btn-outline-danger" title="Remove from Watchlist">
                <i class="bi bi-trash"></i>
            </button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>

    <div 
    v-if="showModal" 
    class="modal fade show" 
    tabindex="-1" 
    role="dialog" 
    style="display: block; background-color: rgba(0, 0, 0, 0.7);" 
    @click.self="hidePosterModal"
    >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
        <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close" aria-label="Close" @click="hidePosterModal"></button>
        </div>
        <div class="modal-body pt-0 text-center custom-modal-body"> <img :src="modalPosterUrl" class="img-fluid rounded" alt="Large Movie Poster" />
        </div>
        </div>
    </div>
    </div>
    
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import WatchlistService from "../services/watchlist";
import movieService from "@/services/movies";
import FavoritesService from "@/services/favorites"; 

// Using w200 for the table thumbnail for efficiency
const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL || 'https://image.tmdb.org/t/p/w200';

export default {
  name: "Watchlist",
  data() {
    return {
      watchlistIds: [], 
      movieDetails: [],
      isLoading: false,
      sortByField: 'vote_average',
      sortDirection: 'desc',
      favorites: [], // Array of favorite objects { movieId: '...', comment: '...', rating: 0 }
      // Modal State
      showModal: false,
      modalPosterUrl: '',
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    userId() {
      return this.authStore.user ? this.authStore.user.id : null;
    },
    /**
     * Sorts the movieDetails array based on the current sort field and direction.
     */
    sortedWatchlist() {
      if (this.movieDetails.length === 0) {
        return [];
      }

      const sorted = [...this.movieDetails];
      const field = this.sortByField;
      const direction = this.sortDirection === 'asc' ? 1 : -1;

      return sorted.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        // Handle string comparison (like 'title')
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          if (aValue < bValue) return -1 * direction;
          if (aValue > bValue) return 1 * direction;
          return 0;
        }

        // Handle numeric/date comparison
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });
    }
  },
  methods: {
    /**
     * Checks if a given movie ID is currently in the favorites list.
     */
    isFavorite(movieId) {
      const movieIdStr = String(movieId);
      return this.favorites.some(f => f.movieId === movieIdStr);
    },

    /**
     * Fetches the user's watchlist IDs, movie details, and favorite list concurrently.
     */
    async getWatchlist() {
      if (!this.userId) {
        this.watchlistIds = [];
        this.movieDetails = [];
        this.favorites = []; 
        return;
      }

      this.isLoading = true;
      try {
        // Fetch Watchlist IDs and Favorites List concurrently
        const watchlistPromise = WatchlistService.getAllWatchlist(this.userId);
        const favoritesPromise = FavoritesService.getAllFavorites(this.userId);

        const [movieIds, favoritesList] = await Promise.all([watchlistPromise, favoritesPromise]);
        
        this.watchlistIds = movieIds;
        this.favorites = favoritesList; 
        
        // Fetch Movie Details for each ID
        if (movieIds.length > 0) {
          const detailPromises = movieIds.map(id => movieService.getMovieDetails(id));
          const details = await Promise.allSettled(detailPromises);

          this.movieDetails = details
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
        } else {
            this.movieDetails = [];
        }
      } catch (error) {
        console.error("Error fetching watchlist/favorites:", error);
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Toggles the favorite status of a movie using the FavoritesService.
     */
    async toggleFavorite(movieId) {
      if (!this.userId) {
        alert("You must be logged in to manage favorites.");
        return;
      }

      this.isLoading = true;
      const isCurrentlyFavorite = this.isFavorite(movieId);
      const movieIdStr = String(movieId);

      try {
        if (isCurrentlyFavorite) {
          // REMOVE from favorites
          await FavoritesService.deleteFromFavorites(this.userId, movieIdStr);
          this.favorites = this.favorites.filter(f => f.movieId !== movieIdStr);
        } else {
          // ADD to favorites
          await FavoritesService.addToFavorites(this.userId, movieIdStr);
          // Manually add the minimal favorite object to local state
          this.favorites.push({ movieId: movieIdStr, comment: "", rating: 0 });
        }
      } catch (error) {
        console.error(`Error ${isCurrentlyFavorite ? 'removing' : 'adding'} favorite:`, error);
        alert(`Error: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Removes an item from the watchlist.
     */
    async removeItem(movieId) {
      if (!confirm(`Are you sure you want to remove ${movieId} from your watchlist?`)) {
        return;
      }
      try {
          await WatchlistService.removeFromWatchlist(this.userId, movieId);
          this.getWatchlist(); 
      } catch (error) {
          alert("Error removing item: " + error.message);
      }
    },

    /**
     * Toggles the sort direction or changes the sort field.
     */
    sortBy(field) {
      if (this.sortByField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortByField = field;
        // Default popular fields to descending
        this.sortDirection = ['runtime', 'vote_average', 'release_date'].includes(field) ? 'desc' : 'asc';
      }
    },
    
    /**
     * Returns the appropriate Bootstrap icon class for the sort indicator.
     */
    getSortIcon(field) {
      if (this.sortByField !== field) {
        return 'bi bi-sort-down text-muted';
      }
      return this.sortDirection === 'asc' 
        ? 'bi bi-sort-alpha-down-alt'
        : 'bi bi-sort-alpha-down';
    },

    // --- Modal Methods ---
    showPosterModal(posterPath) {
      if (posterPath) {
        // Use a larger size (w500) for the modal image
        const largeImageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`; 

        this.modalPosterUrl = largeImageUrl;
        this.showModal = true;
        // Helps control body scrolling and backdrop
        document.body.classList.add('modal-open'); 
      }
    },
    hidePosterModal() {
      this.showModal = false;
      this.modalPosterUrl = '';
      document.body.classList.remove('modal-open');
    },
    // ---------------------

    /**
     * Gets the full URL for the movie poster thumbnail.
     */
    getPosterUrl(path) {
      if (!path) {
        return "https://via.placeholder.com/50x75/333/FFFFFF?text=No+Img";
      }
      // Uses the base size defined at the top (e.g., w200) for the table
      return `${BASE_IMAGE_URL}${path}`;
    },
    
    // --- Formatting Methods ---
    formatRating(rating) {
        if (typeof rating !== 'number') return 'N/A';
        return rating.toFixed(1);
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    },
    
    formatGenres(genres) {
      if (!genres || genres.length === 0) return 'N/A';
      return genres.map(g => g.name).join(', ');
    },
    // --------------------------
  },
  watch: {
    // Watch for user ID changes (login/logout) to re-fetch the watchlist/favorites
    userId: {
        immediate: true, 
        handler(newId, oldId) {
            if (newId !== oldId) {
                this.getWatchlist();
            } else if (newId === null) {
                this.watchlistIds = [];
                this.movieDetails = [];
                this.favorites = []; 
            }
        }
    }
  },
};
</script>

    <style scoped>
        /* ... existing styles ... */

        /* Styles for the poster thumbnail and modal */
        .poster-thumbnail {
        width: 50px; 
        height: 75px; 
        object-fit: cover; 
        border-radius: 4px;
        cursor: pointer; 
        transition: transform 0.2s;
        }

        .poster-thumbnail:hover {
            transform: scale(1.05);
        }

        .modal-content {
            background-color: #fefefe; 
        }
        .modal-body img {
        /* Limit the height to ensure the modal fits within the screen */
        max-height: 85vh; /* 85% of the viewport height (leaving 15% for padding/header/footer) */
        width: auto; /* Allow width to scale based on aspect ratio */
        max-width: 100%; /* Ensure it doesn't overflow horizontally */
        }
        /* Ensure actions column has enough width */
        .text-nowrap {
            white-space: nowrap;
        }
        .sortable > .d-flex {
        /* This ensures the header content takes up the full width/height of the TH */
        width: 100%;
        height: 100%; 
        /* Using `justify-content-start` or `space-between` controls horizontal spacing */
        }

        /* Fix for icon shifting/bouncing */
        .sortable i {
        /* Set a fixed, small size for the icon to reserve space */
        min-width: 1em; 
        text-align: center;
        transition: opacity 0.1s; /* Smooth transition for icon appearance */
        }
    </style>