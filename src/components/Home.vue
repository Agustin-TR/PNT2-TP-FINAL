    <template>
        <div class="container mt-4">
        <h1 class="mb-4 text-center">🍿 Películas Populares</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="movies.length" class="row">
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" v-for="movie in movies" :key="movie.id">
            <div class="card h-100 shadow-sm movie-card">
                <img :src="movie.posterUrl" class="card-img-top" :alt="movie.title">
                <div class="card-body p-2">
                <h6 class="card-title mb-1 text-truncate" :title="movie.title">{{ movie.title }}</h6>
                <p class="card-text small text-muted">{{ movie.year }}</p>
                <button 
                    class="btn btn-sm w-100" 
                    :class="isAdded(movie.id) ? 'btn-success' : 'btn-primary'"
                    @click="toggleWatchlist(movie.id)"
                >
                    {{ isAdded(movie.id) ? '✅ En Watchlist' : '+ Watchlist' }}
                </button>
                </div>
            </div>
            </div>
        </div>

        <div v-else class="alert alert-info text-center" role="alert">
            No se encontraron películas. ¡Intenta recargar!
        </div>
        </div>
        <div>
            <a class="nav-link btn btn-outline-warning" @click.prevent="goToWatchlist">Mi Watchlist ✨ ({{ watchlistCount }})</a>
        </div>
    </template>

    <script>
    export default {
    name: 'Home',
    data() {
        return {
        movies: [
            // Datos de ejemplo para la interfaz
            { id: 1, title: 'Duna', year: 2021, posterUrl: 'https://via.placeholder.com/150x225/555/FFFFFF?text=Duna' },
            { id: 2, title: 'Barbie', year: 2023, posterUrl: 'https://via.placeholder.com/150x225/E04D8C/FFFFFF?text=Barbie' },
            { id: 3, title: 'Oppenheimer', year: 2023, posterUrl: 'https://via.placeholder.com/150x225/333/FFFFFF?text=Oppy' },
            { id: 4, title: 'Inception', year: 2010, posterUrl: 'https://via.placeholder.com/150x225/1A237E/FFFFFF?text=Inception' },
        ],
        watchlist: [2], // Array de IDs de películas en la Watchlist
        loading: false, 
        }
    },
    methods: {
        // Función de navegación simulada
        goToWatchlist() {
        console.log('Navegando a la Watchlist...');
        // Usar Vue Router: this.$router.push('/watchlist');
        },

        // Agrega o quita una película de la watchlist
        toggleWatchlist(movieId) {
        const index = this.watchlist.indexOf(movieId);
        if (index > -1) {
            this.watchlist.splice(index, 1); // Quitar
        } else {
            this.watchlist.push(movieId); // Agregar
        }
        },

        // Verifica si una película está en la watchlist
        isAdded(movieId) {
        return this.watchlist.includes(movieId);
        }
    },
    computed: {
        // Contador reactivo para la barra de navegación
        watchlistCount() {
        return this.watchlist.length;
        }
    },
    mounted() {
        // Aquí se iniciaría la llamada a la API
        // this.fetchMovies(); 
    }
    }
    </script>