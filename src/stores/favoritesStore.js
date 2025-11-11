import { defineStore } from "pinia";
import FavoritesService from "@/services/favorites";

export const useFavoritesStore = defineStore("favorites", {
    state: () => ({
        favorites: [],
        loading: false,
        error: null
    }),

    getters: {
        // Solo verificar si está en favoritos
        isFavorite: (state) => (movieId) => {
            const movieIdStr = String(movieId);
            return state.favorites.some(f => f.movieId === movieIdStr);
        }
    },

    actions: {
        // Cargar favoritos desde el servicio
        async loadFavorites(userId) {
            if (!userId) {
                this.favorites = [];
                return;
            }

            try {
                this.loading = true;
                this.favorites = await FavoritesService.getAllFavorites(userId);
            } catch (err) {
                console.error('Error cargando favoritos:', err);
            } finally {
                this.loading = false;
            }
        },

        // Toggle: delega al servicio y actualiza el estado local
        async toggleFavorite(userId, movieId) {
            const movieIdStr = String(movieId);
            const isFav = this.isFavorite(movieId);

            try {
                if (isFav) {
                    await FavoritesService.deleteFromFavorites(userId, movieIdStr);
                    this.favorites = this.favorites.filter(f => f.movieId !== movieIdStr);
                } else {
                    await FavoritesService.addToFavorites(userId, movieIdStr);
                    const alreadyExists = this.favorites.some(f => f.movieId === movieIdStr);

                    if(!alreadyExists){
                        this.favorites.push({ 
                            movieId: movieIdStr, 
                            comment: "", 
                            rating: 0 
                        });
                    } 
                }
            } catch (err) {
                console.error(`Error toggling favorites for movie ${movieId}:`, err);
            }
        }
    },
})