<template>
  <div class="container mt-4">
    <!-- Tabs -->
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab">
        <button
          class="nav-link"
          :class="{ active: activeTab === tab }"
          :style="{ fontWeight: activeTab === tab ? 'bold' : 'normal' }"
          @click="setActiveTab(tab)"
          type="button"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- TAB: PROFILE -->
      <div v-if="activeTab === 'profile'">
        <Spinner v-if="loading" />
        <form v-else @submit.prevent="saveProfile" class="row g-3" novalidate>
          <div
            class="col-md-6"
            v-for="(value, key) in editableFields"
            :key="key"
          >
            <label :for="key" class="form-label">
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
            </label>
            <input
              :id="key"
              :type="
                key === 'email' ? 'email' : key === 'age' ? 'number' : 'text'
              "
              class="form-control"
              v-model.trim="profile[key]"
              required
            />
          </div>

          <div
            class="col-12 d-flex flex-column flex-lg-row gap-2 justify-content-between"
          >
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? "Saving..." : "Save" }}
            </button>

            <button
              type="button"
              class="btn btn-danger"
              :disabled="deleting"
              @click="openDeleteModal"
            >
              {{ deleting ? "Deleting..." : "Delete" }}
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
          </div>
        </form>
  </div>
      <!-- TAB: WATCHLIST -->
        <div v-if="activeTab === 'watchlist'">
            <Spinner v-if="loading" />
            <Watchlist ref="watchlist" @counter="updateCounter" />
            <ConfirmResetModal :counter="counter" @confirmed="confirmed" />
        </div>

<!-- TAB: FAVORITES -->
<div v-if="activeTab === 'favorites'">
  <!-- Título y botón Remove All en la misma línea -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h3 class="mb-0">❤️ My Favorites</h3>
    
    <button 
      v-if="favorites.length > 0"
      class="btn btn-outline-danger"
      @click="removeAllFavorites"
    >
      <i class="bi bi-trash"></i> Remove All
    </button>
  </div>
  
  <!-- Spinner mientras carga -->
  <Spinner v-if="loadingFavorites" />
  
  <!-- Mensaje si no hay favoritos -->
  <div v-else-if="favorites.length === 0" class="alert alert-info">
    <i class="bi bi-info-circle me-2"></i>
    You don't have any favorites yet. Start adding movies!
  </div>
  
  <!-- Grid de películas favoritas -->
  <div v-else class="row g-3">
    <div 
      v-for="movie in favorites" 
      :key="movie.id"
      class="col-6 col-md-4 col-lg-3"
    >
      <div class="card h-100 shadow-sm">
        <img 
          :src="movie.posterUrl" 
          class="card-img-top" 
          :alt="movie.title"
          @click="goToMovie(movie.movieId)"
          style="cursor: pointer"
          loading="lazy"
        />
        <div class="card-body p-2">
          <h6 
            class="card-title mb-1" 
            style="font-size: 0.9rem; height: 40px; overflow: hidden; cursor: pointer"
            :title="movie.title"
            @click="goToMovie(movie.movieId)"
          >
            {{ movie.title }}
          </h6>
          <p class="card-text small text-muted mb-2">
            {{ movie.year }} • ⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}
          </p>
          <button 
            class="btn btn-sm btn-outline-danger w-100"
            @click="removeFavorite(movie.movieId)"
          >
            <i class="bi bi-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mensajes de error y éxito -->
  <div v-if="errorMessage" class="alert alert-danger mt-3">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success mt-3">
    {{ successMessage }}
  </div>
</div>        

      <!-- Modal -->
      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
        ref="deleteModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="confirmDelete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import authService from "@/services/auth";
import movieService from "@/services/movies";
import Spinner from "./Spinner.vue";
import ConfirmResetModal from "./ConfirmResetModal.vue";
import Watchlist from "./Watchlist.vue";
import WatchlistService from "@/services/watchlist";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
  name: "Profile",
  components: { Spinner, ConfirmResetModal, Watchlist },
  data() {
    return {
      activeTab: "profile",
      tabs: ["profile", "watchlist", "favorites"],
      editableFields: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        age: null,
      },
      profile: {},
      watchlist: [],
      favorites: [],
      loading: false,
      saving: false,
      deleting: false,
      errorMessage: "",
      successMessage: "",
      modalInstance: null,
      authStore: useAuthStore(),
      favoritesStore: useFavoritesStore(), // Instancia del store de favs
      loadingFavorites: false, //  Loading  para favs    
      counter: 0
    };
  },
  computed: {
    currentList() {
      if (this.activeTab === "watchlist") return this.watchlist;
      if (this.activeTab === "favorites") return this.favorites;
      return [];
    },
    storeFavorites() {
      return this.favoritesStore.favorites;
    }
  },
  methods: {
    updateCounter(newCount) {
        this.counter = newCount;
    },
    async confirmed(res) {
        console.log("🧉 ~ res ➡️ ", res)
        if (res) {
            const a = await WatchlistService.resetWatchlist();
            if(a){
                await this.reloadComponent();
            }            
        }
    },
    async reloadComponent() {
        Object.assign(this.$data, this.$options.data.call(this));
        await this.loadProfile();
        this.activeTab = "watchlist";
    },
    setActiveTab(tab) {
      this.activeTab = tab;

      if (tab === 'favorites' && this.favorites.length === 0) {
        this.loadFavorites();
      } else if (tab === "watchlist") {
        this.loadWatchlist(); 
    }
    },
    async loadProfile() {
      this.loading = true;
      try {
        const user = await authService.loadAccount();
        this.profile = { ...user };
      } catch (err) {
        this.errorMessage = err.message || "Failed to load profile.";
      } finally {
        this.loading = false;
      }
    },
    async saveProfile() {
      this.saving = true;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        const updated = await authService.updateAccount(this.profile);
        this.profile = { ...updated };
        this.successMessage = "Profile updated successfully.";
      } catch (err) {
        this.errorMessage = err.message || "Failed to update profile.";
      } finally {
        this.saving = false;
      }
    },
    async loadFavorites() {
      this.loadingFavorites = true;
      this.errorMessage = "";
    
      try {
        // Cargar favoritos desde el store
        await this.favoritesStore.loadFavorites(this.userId);
      
        // Si no hay favoritos, vaciar y salir
        if (this.storeFavorites.length === 0) {
          this.favorites = [];
          return;
        }
      
        // Obtener detalles de cada película
        const detailsPromises = this.storeFavorites.map(async (fav) => {
          try {
            const movieData = await movieService.getMovieDetails(fav.movieId);
          
            return {
              id: fav.id,
              movieId: fav.movieId,
              title: movieData.title,
              year: movieData.release_date?.split('-')[0] || 'N/A',
              posterUrl: movieData.poster_path 
                ? `${BASE_IMAGE_URL}${movieData.poster_path}` 
                : 'https://via.placeholder.com/150x225/333/FFFFFF?text=No+Poster',
              vote_average: movieData.vote_average,
              release_date: movieData.release_date,
              createdAt: fav.createdAt
            };
          } catch (err) {
            console.error(`Error loading movie ${fav.movieId}:`, err);
            return null;
          }
        });
      
        const movies = await Promise.allSettled(detailsPromises);
        this.favorites = movies
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value);
        
      } catch (err) {
        this.errorMessage = 'Error loading favorites: ' + err.message;
        console.error(err);
      } finally {
        this.loadingFavorites = false;
      }

    },
    loadWatchlist() {
  this.activeTab = "watchlist";

  // Si querés forzar que el componente hijo recargue:
  this.$refs.watchlist?.loadData?.();
},
    async removeFavorite(movieId) {
      if (!confirm('Are you sure you want to remove this movie from favorites?')) {
        return;
      }
    
      try {
        await this.favoritesStore.removeFavorite(movieId);
      
        // Actualizar la lista local
        this.favorites = this.favorites.filter(f => f.movieId !== String(movieId));
      
        this.successMessage = 'Favorite removed successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (err) {
        this.errorMessage = 'Error removing favorite: ' + err.message;
        console.error(err);
      }
    },
    async removeAllFavorites(){
        if (!confirm('Are you sure you want to remove all your movies from favorites?')) {
        return;
      }

      try{
        await this.favoritesStore.removeAllFavorites();
        this.favorites = [];

        alert('All favorites removed successfully!');
        setTimeout(() => this.successMessage = '', 3000);
      } catch (err){
        this.error = 'Error removing all favorites: ' + err.message;
        console.error(err);
      }
    },

    goToMovie(movieId) {
      this.$router.push(`/movies/${movieId}`);
    },    
    openDeleteModal() {
      const modalEl = this.$refs.deleteModal;
      this.modalInstance = new Modal(modalEl);
      this.modalInstance.show();
    },
    async confirmDelete() {
      this.deleting = true;
      try {
        await authService.deleteAccount();

        this.successMessage = "Account deleted successfully.";
        this.modalInstance.hide();

        setTimeout(() => {
          this.authStore.logout();
          this.$router.push("/");
        }, 2000);
      } catch (err) {
        this.errorMessage = err.message || "Failed to delete account.";
      } finally {
        this.deleting = false;
      }
    },
  },
  mounted() {
    this.loadProfile();

    if (this.activeTab === 'favorites' && this.userId) {
      this.loadFavorites();
    }
  },
  unmounted() {
    this.loadProfile();
  },
};
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
