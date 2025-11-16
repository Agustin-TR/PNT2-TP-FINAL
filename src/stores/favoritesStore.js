import { defineStore } from "pinia";
import FavoritesService from "@/services/favorites";

export const useFavoritesStore = defineStore("favorites", {
    state: () => ({
        favorites: [],
        ratings: [],
        comments: [],
        loading: false,
        error: null
    }),

    getters: {
        // Favoritos
        isFavorite: (state) => (movieId) => {
            return FavoritesService.isFavorite(movieId);
        },

        getFavoriteByMovieId: (state) => (movieId) => {
            const movieIdStr = String(movieId);
            return state.favorites.find(f => String(f.movieId) === movieIdStr);
        },

        // Ratings
        getRating: (state) => (movieId) => {
            return FavoritesService.getRating(movieId);
        },

        hasRating: (state) => (movieId) => {
            return FavoritesService.getRating(movieId) !== null;
        },

        // Comments
        getComment: (state) => (movieId) => {
            return FavoritesService.getComment(movieId);
        },

        hasComment: (state) => (movieId) => {
            return FavoritesService.getComment(movieId) !== null;
        }
    },

    actions: {
        // ========== FAVORITES ==========
        async loadFavorites(userId) {
            try {
                this.loading = true;
                this.favorites = await FavoritesService.getAllFavorites(userId);
            } catch (err) {
                this.error = err.message;
                console.error('Error cargando favoritos:', err);
            } finally {
                this.loading = false;
            }
        },

        async addFavorite(userId, movieId) {
            try {
                const response = await FavoritesService.addToFavorites(userId, movieId);
                this.favorites = await FavoritesService.getAllFavorites(userId);
                return response;
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },


        async removeFavorite(movieId) {
            try {
                const movieIdStr = String(movieId);
                const favorite = this.favorites.find(f => String(f.movieId) === movieIdStr);

                if (!favorite) throw new Error('Favorito no encontrado');

                await FavoritesService.deleteFromFavorites(favorite.id);

                this.favorites = this.favorites.filter(f => f.id !== favorite.id);

            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async removeAllFavorites() {
            try {
                await FavoritesService.removeAllFavorites();
                this.favorites = [];
                return { message: 'All favorites removed successfully' };
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async toggleFavorite(userId, movieId) {
            const isFav = FavoritesService.isFavorite(movieId);

            if (isFav) {
                await this.removeFavorite(movieId);
            } else {
                await this.addFavorite(userId, movieId);
            }
        },

        // ========== RATINGS ==========
        async setRating(userId, movieId, rating) {
            try {
                const result = await FavoritesService.setRating(userId, movieId, rating);

                // Actualizar estado local
                this.ratings = FavoritesService.getAllRatings();

                return result;
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async deleteRating(movieId) {
            try {
                await FavoritesService.deleteRating(movieId);
                this.ratings = FavoritesService.getAllRatings();
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        // ========== COMMENTS ==========
        async setComment(movieId, comment) {
            try {
                const result = await FavoritesService.setComment(movieId, comment);

                // Actualizar estado local
                this.comments = FavoritesService.getAllComments();

                return result;
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async deleteComment(movieId) {
            try {
                await FavoritesService.deleteComment(movieId);
                this.comments = FavoritesService.getAllComments();
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },
    },
})