<template>
    <div class="container mt-4">
        <h1 class="mb-4 text-center">🍿 Películas Populares</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-danger text-center" role="alert">
            Error al cargar películas: {{ error }}
        </div>

        <div v-else-if="movies.length" class="row">
            <div
                class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
                v-for="movie in movies"
                :key="movie.id"
            >
                <div 
                    class="card h-100 shadow-sm movie-card clickable" 
                    @click="goToDetails(movie.id)" 
                    style="cursor: pointer;"
                >
                    <img :src="movie.posterUrl" class="card-img-top" :alt="movie.title" loading="lazy">
                    
                    <div class="card-body p-2">
                        <h6 class="card-title mb-1 text-truncate" :title="movie.title">
                            {{ movie.title }}
                        </h6>
                        <p class="card-text small text-muted">{{ movie.year }}</p>

                        <button
                            class="btn btn-sm w-100"
                            :class="isFavorite(movie.id) ? 'btn-success' : 'btn-primary'"
                            @click.stop="toggleFavs(movie.id)" 
                            id="btn-favs"
                        >
                            {{ isFavorite(movie.id) ? '❤️' : '+ ♡' }}
                        </button>
                        
                        <button
                            class="btn btn-sm w-100"
                            :class="isAdded(movie.id) ? 'btn-success' : 'btn-primary'"
                            @click.stop="toggleWatchlist(movie.id)" 
                        >
                            {{ isAdded(movie.id) ? '✅ En Watchlist' : '+ Watchlist' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-info text-center" role="alert">
            No se encontraron películas populares.
        </div>
    </div>
    
    <div class="d-flex justify-content-center mt-3 mb-5">
        <a class="nav-link btn btn-outline-warning" @click.prevent="goToWatchlist">
            Mi Watchlist ✨ ({{ watchlistCount }})
        </a>
    </div>
</template>


<script>
// Importa tu clase de servicio de películas
import ServicioPeliculas from '../servicios/peliculas'; 

// ⚠️ Usar variables de entorno (p. ej., process.env.VUE_APP_TMDB_TOKEN) es la mejor práctica.
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjczMjI2MGUyZGE5MGEzOGEwNzhkZDEwM2MyODRmZiIsIm5iZiI6MTc2MTgzNDI3Ni4yODEsInN1YiI6IjY5MDM3NTI0M2FjMWEzNWM4NmU5OTZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1PT2L_iOfHyAHqAgk56ERvoKF0ojmKDMwr2UOIqpI-w";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w200"; // URL base para las imágenes de póster

// Inicializamos el servicio fuera del componente o en 'created'
const movieService = new ServicioPeliculas(TMDB_ACCESS_TOKEN);

export default {
    name: 'Home',
    data() {
        return { 
            movies: [], // Deja esto vacío, se llenará con la API
            watchlist: [],
            favorites: [], //array para guardar las peliculas como favoritas 
            loading: true, // Inicializa como true para mostrar el spinner al inicio
            error: null, // Para manejar errores
        }
    },
    methods: {
        goToWatchlist() {
            this.$router.push('/Watchlist');
            console.log('Navegando a la Watchlist...');
            
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
        this.$router.push({ name: 'PeliculaDetalle', params: { id: movieId } });
        },

        /**
         * 🎬 Nuevo método para obtener películas populares de la API
         */
        async fetchPopularMovies() {
            this.loading = true; // Muestra el spinner
            this.error = null; // Limpia errores previos
            try {
                // Llama a la API (necesitas agregar este método al ServicioPeliculas)
                // Usaremos buscarPeliculas para este ejemplo, pero lo adaptaremos para 'popular'
                const results = await movieService.getPopularMovies(); 

                // Mapeamos los resultados de la API al formato que usa tu template
                this.movies = results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
                    // Construye la URL completa del póster
                    posterUrl: movie.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/150x225/333/FFFFFF?text=Sin+Poster', 
                }));

            } catch (err) {
                console.error("Error al cargar películas populares:", err);
                this.error = "No se pudieron cargar las películas. Por favor, inténtalo más tarde.";
            } finally {
                this.loading = false; // Oculta el spinner
            }
        }

        
    },
    computed: {
        watchlistCount() {
            return this.watchlist.length;
        }
    },
    mounted() {
        // Llama a la función al cargar el componente
        this.fetchPopularMovies(); 
    }
}
</script>

<style scoped>
    #btn-favs{
        margin-bottom: 5px;
    }
</style>