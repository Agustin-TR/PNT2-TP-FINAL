<template>
    <div class="container mt-5">
        <h2 class="mb-4">📺 My Watchlist</h2>

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
                <!-- 🔹 Clickable title that redirects -->
                <td>
                <span class="movie-title" @click="goToMovie(movie.id)">
                    <strong>{{ movie.title }}</strong>
                </span>
                </td>
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

        <!-- Poster Modal -->
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
            <div class="modal-body pt-0 text-center custom-modal-body">
                <img :src="modalPosterUrl" class="img-fluid rounded" alt="Large Movie Poster" />
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
        favorites: [],
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
        sortedWatchlist() {
        if (this.movieDetails.length === 0) return [];
        const sorted = [...this.movieDetails];
        const field = this.sortByField;
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        return sorted.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];
            if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
            if (aValue < bValue) return -1 * direction;
            if (aValue > bValue) return 1 * direction;
            return 0;
            }
            if (aValue < bValue) return -1 * direction;
            if (aValue > bValue) return 1 * direction;
            return 0;
        });
        }
    },
    methods: {
        // 🔹 Navigate to movie detail page
        goToMovie(movieId) {
        this.$router.push(`/movies/${movieId}`);
        },

        isFavorite(movieId) {
        const movieIdStr = String(movieId);
        return this.favorites.some(f => f.movieId === movieIdStr);
        },

        async getWatchlist() {
        if (!this.userId) {
            this.watchlistIds = [];
            this.movieDetails = [];
            this.favorites = []; 
            return;
        }

        this.isLoading = true;
        try {
            const [movieIds, favoritesList] = await Promise.all([
            WatchlistService.getAllWatchlist(this.userId),
            FavoritesService.getAllFavorites(this.userId),
            ]);
            this.watchlistIds = movieIds;
            this.favorites = favoritesList; 
            if (movieIds.length > 0) {
            const details = await Promise.allSettled(movieIds.map(id => movieService.getMovieDetails(id)));
            this.movieDetails = details
                .filter(r => r.status === 'fulfilled' && r.value)
                .map(r => r.value);
            } else this.movieDetails = [];
        } catch (error) {
            console.error("Error fetching watchlist/favorites:", error);
        } finally {
            this.isLoading = false;
        }
        },

        async toggleFavorite(movieId) {
        if (!this.userId) {
            alert("You must be logged in to manage favorites.");
            return;
        }
        this.isLoading = true;
        const isFav = this.isFavorite(movieId);
        const movieIdStr = String(movieId);
        try {
            if (isFav) {
            await FavoritesService.deleteFromFavorites(this.userId, movieIdStr);
            this.favorites = this.favorites.filter(f => f.movieId !== movieIdStr);
            } else {
            await FavoritesService.addToFavorites(this.userId, movieIdStr);
            this.favorites.push({ movieId: movieIdStr, comment: "", rating: 0 });
            }
        } catch (err) {
            console.error(`Error ${isFav ? 'removing' : 'adding'} favorite:`, err);
            alert(`Error: ${err.message}`);
        } finally {
            this.isLoading = false;
        }
        },

        async removeItem(movieId) {
        if (!confirm(`Are you sure you want to remove ${movieId} from your watchlist?`)) return;
        try {
            await WatchlistService.removeFromWatchlist(this.userId, movieId);
            this.getWatchlist();
        } catch (err) {
            alert("Error removing item: " + err.message);
        }
        },

        sortBy(field) {
        if (this.sortByField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortByField = field;
            this.sortDirection = ['runtime', 'vote_average', 'release_date'].includes(field) ? 'desc' : 'asc';
        }
        },

        getSortIcon(field) {
        if (this.sortByField !== field) return 'bi bi-sort-down text-muted';
        return this.sortDirection === 'asc'
            ? 'bi bi-sort-alpha-down-alt'
            : 'bi bi-sort-alpha-down';
        },

        showPosterModal(posterPath) {
        if (posterPath) {
            const largeImageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`; 
            this.modalPosterUrl = largeImageUrl;
            this.showModal = true;
            document.body.classList.add('modal-open'); 
        }
        },
        hidePosterModal() {
        this.showModal = false;
        this.modalPosterUrl = '';
        document.body.classList.remove('modal-open');
        },

        getPosterUrl(path) {
        if (!path) return "https://via.placeholder.com/50x75/333/FFFFFF?text=No+Img";
        return `${BASE_IMAGE_URL}${path}`;
        },
        
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
    },
    watch: {
        userId: {
        immediate: true,
        handler(newId, oldId) {
            if (newId !== oldId) this.getWatchlist();
            else if (newId === null) {
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
    .movie-title {
    color: #0d6efd;
    cursor: pointer;
    transition: color 0.2s;
    }
    .movie-title:hover {
    text-decoration: underline;
    color: #0a58ca;
    }
    .text-nowrap {
    white-space: nowrap;
    }
</style>
