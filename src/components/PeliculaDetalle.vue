<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="movie" class="row">
      <div class="col-md-4 mb-4">
        <img :src="posterUrl" class="img-fluid rounded shadow-lg" :alt="movie.title">
      </div>
      <div class="col-md-8">
        <h1 class="display-4">{{ movie.title }} ({{ releaseYear }})</h1>
        <p class="lead text-muted">{{ movie.tagline }}</p>

        <hr>

        <p>
            **Puntuación:** <span class="badge bg-warning text-dark">{{ movie.vote_average.toFixed(1) }}</span> / 10
            ({{ movie.vote_count }} votos)
        </p>

        <p>
            **Géneros:** <span v-for="genre in movie.genres" :key="genre.id" class="badge bg-secondary me-2">
                {{ genre.name }}
            </span>
        </p>
        
        <p>
            **Duración:** {{ movie.runtime }} minutos
        </p>

        <h2 class="mt-4">Sinopsis</h2>
        <p>{{ movie.overview }}</p>

       

        <button class="btn btn-lg btn-outline-primary mt-3" @click="$router.go(-1)">
            ← Volver
        </button>
      </div>
    </div>

    <div v-else class="alert alert-info text-center">
        No se encontró la película con ID {{ $route.params.id }}.
    </div>
  </div>
</template>

<script>
import ServicioPeliculas from '../servicios/peliculas'; 

// acá va el Bearer Token real.
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjczMjI2MGUyZGE5MGEzOGEwNzhkZDEwM2MyODRmZiIsIm5iZiI6MTc2MTgzNDI3Ni4yODEsInN1YiI6IjY5MDM3NTI0M2FjMWEzNWM4NmU5OTZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1PT2L_iOfHyAHqAgk56ERvoKF0ojmKDMwr2UOIqpI-w";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500"; 

const movieService = new ServicioPeliculas(TMDB_ACCESS_TOKEN);

export default {
    name: 'DetallePelicula',
    // al usar Vue Router, los props se obtienen de la URL
    props: ['id'], 
    data() {
        return {
            movie: null,
            loading: true,
            error: null,
        }
    },
    computed: {
        releaseYear() {
            return this.movie?.release_date ? new Date(this.movie.release_date).getFullYear() : 'N/A';
        },
        posterUrl() {
            return this.movie?.poster_path ? `${BASE_IMAGE_URL}${this.movie.poster_path}` : 'https://via.placeholder.com/500x750/333/FFFFFF?text=Sin+Poster';
        }
    },
    methods: {
        async fetchMovieDetails() {
            this.loading = true;
            this.error = null;
            // El ID de la película se obtiene de la ruta (this.$route.params.id) o del prop 'id'
            const movieId = this.id || this.$route.params.id; 

            if (!movieId) {
                this.error = "ID de película no proporcionado.";
                this.loading = false;
                return;
            }

            try {
                // Llama al nuevo método del servicio
                this.movie = await movieService.getDetallesPelicula(movieId);
            } catch (err) {
                console.error("Error al obtener detalles:", err);
                this.error = "No se pudieron cargar los detalles de la película.";
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        // Carga los detalles cuando el componente se monta
        this.fetchMovieDetails();
    }
}
</script>

<style scoped>
/* Estilos básicos para la página de detalle */
.rounded {
    border-radius: 0.5rem !important;
}
</style>