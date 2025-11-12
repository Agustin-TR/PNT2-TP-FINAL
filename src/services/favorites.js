import { useAuthStore } from "@/stores/authStore";

class FavoritesService {
  // ========== FAVORITOS ==========
  getAllFavorites = async () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    return user.favorites || []; // Returns the array of favorite objects
  };

  addToFavorites = async (userId, movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);

    if (!user.favorites) user.favorites = []; //Inicializar el array si no existe

    if (user.favorites.some(f => f && f.movieId === idStr)) {
      throw new Error("The movie is already in favorites.");
    }

    //Agregar el favorito
    const newFavorite = {
      id: Date.now(), // ID temporal usando timestamp
      userId: user.id,
      movieId: idStr,
      //createdAt: new Date().toISOString()
    };

    user.favorites.push(newFavorite);
    //user.favorites.push(idStr);
    this._updateUser(authStore, user); //guardar cambios

    return { 
      message: 'Movie added to favorites',
      favorite: newFavorite
    }
  };

  deleteFromFavorites = async (favoriteId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    if (!user.favorites) user.favorites = [];

    // Buscar el índice del favorito
    const index = user.favorites.findIndex(f => f && f.id === favoriteId);

    if (index === -1){
      throw new Error("Favorite not found.");
    }

    user.favorites.splice(index, 1); //eliminar del array

    this._updateUser(authStore, user); //guardar cambios
    return { message: 'Favorite removed successfully' };
  };

  isFavorite = (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) return false;
    if (!user.favorites || !Array.isArray(user.favorites)) return false;
    
    const idStr = String(movieId);
    return user.favorites.some(f => f && f.movieId && f.movieId === idStr) || false;
  };

  removeAllFavorites = async () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    // Vaciar el array de favoritos
    user.favorites = [];
    
    this._updateUser(authStore, user);
    
    return { 
      message: 'All favorites removed successfully',
      count: 0
    };
  };

  // ========== RATINGS  ==========
  setRating = async (userId, movieId, rating) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");
    
    // Validacion
    if (typeof rating !== 'number' || rating < 0 || rating > 10) {
      throw new Error('Rating must be a number between 0 and 10.');
    }
    
    const idStr = String(movieId);
    if (!user.ratings) user.ratings = [];
    
    const existingRating = user.ratings.find(r => r && r.movieId === idStr);
    if (existingRating) {
      // Actualizar rating existente
      existingRating.rating = rating;
      existingRating.updatedAt = new Date().toISOString();
    } else {
      // Crear nuevo rating
      user.ratings.push({
        movieId: idStr,
        rating: rating,
        createdAt: new Date().toISOString()
      });
    }

    this._updateUser(authStore, user);

    return {
      message: 'Rating saved successfully',
      rating: user.ratings.find(r => r.movieId === idStr)
    };
  };

  getRating = (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user || !user.ratings) return null;
    
    const idStr = String(movieId);
    const rating = user.ratings.find(r => r && r.movieId === idStr);
    
    return rating ? rating.rating : null;
  }; 

  deleteRating = async (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) throw new Error("User not found.");
    
    if (!user.ratings) user.ratings = [];
    
    const idStr = String(movieId);
    const index = user.ratings.findIndex(r => r && r.movieId === idStr);
    
    if (index === -1) {
      throw new Error('Rating not found.');
    }
    
    user.ratings.splice(index, 1);
    this._updateUser(authStore, user);
    
    return { message: 'Rating deleted successfully' };
  };

  getAllRatings = () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) return [];
    
    return user.ratings || [];
  }; 
  
  // ========== COMMENTS ==========
  
  setComment = async (movieId, comment) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) throw new Error("User not found.");
    
    if (!comment || comment.trim() === '') {
      throw new Error('Comment cannot be empty.');
    }
    
    const idStr = String(movieId);
    
    // Inicializar array si no existe
    if (!user.comments) user.comments = [];
    
    // Buscar si ya existe un comentario para esta película
    const existingComment = user.comments.find(c => c && c.movieId === idStr);
    
    if (existingComment) {
      // Actualizar comentario existente
      existingComment.comment = comment.trim();
      existingComment.updatedAt = new Date().toISOString();
    } else {
      // Crear nuevo comentario
      user.comments.push({
        movieId: idStr,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      });
    }
    
    this._updateUser(authStore, user);
    
    return {
      message: 'Comment saved successfully',
      comment: user.comments.find(c => c && c.movieId === idStr)
    };
  };

  getComment = (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user || !user.comments) return null;
    
    const idStr = String(movieId);
    const comment = user.comments.find(c => c && c.movieId === idStr);
    
    return comment ? comment.comment : null;
  };

  deleteComment = async (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) throw new Error("User not found.");
    
    if (!user.comments) user.comments = [];
    
    const idStr = String(movieId);
    const index = user.comments.findIndex(c => c && c.movieId === idStr);
    
    if (index === -1) {
      throw new Error('Comment not found.');
    }
    
    user.comments.splice(index, 1);
    this._updateUser(authStore, user);
    
    return { message: 'Comment deleted successfully' };
  };

  getAllComments = () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    
    if (!user) return [];
    
    return user.comments || [];
  };
  
  // ========== HELPER PRIVADO ==========
  
  _updateUser(authStore, user) {
    authStore.user = user;
    
    if (localStorage.getItem("token")) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }
}

export default new FavoritesService();