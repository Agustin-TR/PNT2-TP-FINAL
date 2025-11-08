
<template>
    <div class="container mt-5">
        <h2 class="mb-4">⭐ My Favorites</h2>

        <div v-if="!isAuthenticated" class="alert alert-danger" role="alert">
            **Error:** You must be logged in to view your favorites.
        </div>

        <div v-else-if="loading" class="alert alert-info" role="alert">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        Loading Favorites...
        </div>

        <div v-else-if="favoritesWithDetails.length === 0" class="alert alert-secondary" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i>
            Your favorite list is currently **empty**. Add some movies!
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
                    <tr v-for="(movie, index) in sortedFavorites" :key="movie.id">
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
                               @click="deleteFav(movie.id)" 
                               class="btn btn-sm btn-outline-danger"
                               title="Remove from Favorites"
                           >
                           <i class="bi bi-trash"></i>
                           </button>                                  
                        </td>
                    </tr>
            </tbody>
            </table>
        </div>

        <!-- Poster Modal -->
        <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" 
            style="display: block; background-color: rgba(0, 0, 0, 0.7);" @click.self="hidePosterModal">
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

<script scoped>
    import { useAuthStore } from "@/stores/authStore";
    import movieService from "@/services/movies";
    import FavoritesService from "@/services/favorites"; 

    const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL || 'https://image.tmdb.org/t/p/w200';

    export default {
        name: 'Favorites',

        data() {
            return {
                favorites: [],
                favoritesWithDetails: [],
                loading: false,
                error: null,
                sortByField: 'vote_average',
                sortDirection: 'desc',
                showModal: false,
                modalPosterUrl: ''
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
 
            sortedFavorites() {
                if (this.favoritesWithDetails.length === 0) return [];
                const sorted = [...this.favoritesWithDetails];
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
            async loadFavorites() {
                if(!this.userId){
                    this.$router.push('/login');
                    return;
                }
                this.loading = true;
                this.error = null;
                
                try {
                    this.favorites = await FavoritesService.getAllFavorites(this.userId);
                    if (this.favorites.length === 0) {
                        this.favoritesWithDetails = [];
                        return;
                    }

                    const detailsPromises = this.favorites.map(async (fav) =>{
                        try{
                            const movieData = await movieService.getMovieDetails(fav.movieId);

                            return {
                                id: fav.movieId,
                                title: movieData.title,
                                year: movieData.release_date?.split('-')[0] || 'N/A',
                                poster_path: movieData.poster_path,
                                vote_average: movieData.vote_average,
                                genres: movieData.genres,
                                runtime: movieData.runtime,
                                release_date: movieData.release_date,
                                tagline: movieData.tagline,
                                comment: fav.comment,  
                                rating: fav.rating      
                            };
                        }catch (err){
                            console.error(`Error cargando pelicula ${fav.movieId}:`, err);
                            return null;
                        }
                    });

                    const movies = await Promise.allSettled(detailsPromises);
                    this.favoritesWithDetails = movies
                        .filter(r => r.status === 'fulfilled' && r.value)
                        .map(r => r.value);
                    console.log('Favoritos con detalles: ' , this.favoritesWithDetails);

                } catch (err) {
                    this.error = 'Error al cargar favoritos: ' + err.message;
                    console.error(err);
                } finally {
                    this.loading = false;
                }
            },

            async deleteFav(movieId){
                if (!confirm('Are you sure you want to remove this movie from favorites?')) {
                    return;
                }
                
                try{
                    await FavoritesService.deleteFromFavorites(this.userId, movieId);

                    // Actualizar arrays locales sin recargar todo
                    this.favorites = this.favorites.filter(f => f.movieId !== String(movieId));
                    this.favoritesWithDetails = this.favoritesWithDetails.filter(m => m.id !== String(movieId));
                } catch (err){
                    this.error = 'Error al eliminar: ' + err.message;
                    console.error(err);
                }
            },

            isFavorite(movieId){
                const movieIdStr = String(movieId);
                return this.favorites.some(f => f.movieId === movieIdStr);
            },

            goToMovie(movieId){
                this.$router.push(`/movies/${movieId}`);
            },

            sortBy(field){
                if (this.sortByField === field){
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                }else {
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

        mounted(){
            this.loadFavorites();
        },

        watch: {
            userId: {
                immediate: true,
                handler(newId, oldId) {
                    if (newId !== oldId && newId !== null) {
                        this.loadFavorites();
                    } else if (newId === null) {
                        this.favorites = [];
                        this.favoritesWithDetails = [];
                    }
                }
            }
        }            
    }
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

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>