<template>
  <div class="buscador-reactivo dropdown ms-auto me-3" :class="{ 'show': showDropdown }">
    
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar películas..."
        v-model="searchText"
        @input="debouncedSearch"
        @focus="showDropdown = true"
        @blur="hideDropdown"
      />
   <span class="input-group-text search-icon" @click="goToFirstResult" style="cursor: pointer">
        <i class="bi bi-search"></i>
    </span>
    </div>

    <ul class="dropdown-menu" :class="{ 'show': showDropdown }" @mousedown.prevent>
      
      <li v-if="loading" class="dropdown-item text-center">
        <span class="spinner-border spinner-border-sm"></span> Cargando...
      </li>

      <li v-else-if="results.length" v-for="movie in results" :key="movie.id">
        <a 
          class="dropdown-item d-flex align-items-center" 
          href="#" 
          @click.prevent="goToDetails(movie.id)"
        >
          <img :src="movie.posterUrl" alt="Poster" class="poster-small me-2">
          <span class="text-truncate">{{ movie.title }} ({{ movie.year }})</span>
        </a>
      </li>

      <li v-else-if="searchText && !loading && searchText.length >= 3" class="dropdown-item text-muted">
        No se encontraron resultados para "{{ searchText }}".
      </li>
      
      <li v-else class="dropdown-item text-muted">
        Escribe al menos 3 caracteres
      </li>
    </ul>
  </div>
</template>

<script>
import ServicioPeliculas from '../servicios/peliculas';
import debounce from 'lodash.debounce'; 


const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjczMjI2MGUyZGE5MGEzOGEwNzhkZDEwM2MyODRmZiIsIm5iZiI6MTc2MTgzNDI3Ni4yODEsInN1YiI6IjY5MDM3NTI0M2FjMWEzNWM4NmU5OTZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1PT2L_iOfHyAHqAgk56ERvoKF0ojmKDMwr2UOIqpI-w";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w92"; // Pequeño tamaño para el dropdown

const movieService = new ServicioPeliculas(TMDB_ACCESS_TOKEN);

export default {
    name: 'Buscador',
    data() {
        return {
            searchText: '',
            results: [],
            loading: false,
            showDropdown: false,
        };
    },
    created() {
        // Aplica un retardo (debounce) de 300ms a la función de búsqueda
        this.debouncedSearch = debounce(this.fetchResults, 300); 
    },
    methods: {
        async fetchResults() {
            const query = this.searchText.trim();

            if (query.length < 3) {
                this.results = [];
                this.showDropdown = query.length > 0;
                return;
            }

            this.loading = true;
            this.showDropdown = true;
            
            try {
                // Llama al método buscarPeliculas de peliculas.js
                const data = await movieService.buscarPeliculas(query);

                // Mapea y limita los resultados para el dropdown (máx. 7)
                this.results = data.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
                    posterUrl: movie.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/92x138/333/FFFFFF?text=NP', 
                })).slice(0, 7);
                
            } catch (error) {
                console.error("Error al buscar:", error);
                this.results = [];
            } finally {
                this.loading = false;
            }
        },
        
        goToDetails(movieId) {
            this.$router.push({ name: 'PeliculaDetalle', params: { id: movieId } });
            
            // Limpia el estado y cierra el dropdown después de la navegación
            this.searchText = ''; 
            this.results = [];
            this.showDropdown = false;
        },

        hideDropdown() {
             // Pequeño retardo para permitir el evento de clic antes de cerrar el menú
            setTimeout(() => {
                this.showDropdown = false;
            }, 150); 
        }
    }
};
</script>

<style scoped>
.buscador-reactivo {
    position: relative;
    width: 500px;
    margin-right: 20px;
}

.input-group {
    border-radius: 2px;
    overflow: hidden;
}

.form-control {
    border: none;
    box-shadow: none;
    padding-right: 0.5rem; /* Ajuste para el icono */
}

.input-group-text {
    background-color: white;
    border: none;
    color: #495057;
    padding-left: 0.5rem;
}

/* Estilo del Dropdown */
.dropdown-menu {
    position: absolute;
    width: 100%;
    z-index: 1050; 
    max-height: 600px;
    overflow-y: auto;
    display: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.dropdown-menu.show {
    display: block;
}

.poster-small {
    width: 40px; 
    height: 60px;
    object-fit: cover;
    border-radius: 3px;
}

.dropdown-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dropdown-item:hover{
    background-color: #495057b0;
}
.dropdown-item:active {
    background-color: #0d6efd;
    color: white;
}

</style>