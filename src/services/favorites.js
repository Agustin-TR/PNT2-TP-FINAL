import {
  findUser,
  setFavorite,
  deleteFavorite,
  setRatingDB,
  deleteRatingDB,
  deleteComment,
  setComment,
} from "./db";

class FavoritesService {
  getAllFavorites = async (userId) => {
    // --- Get all favorites
    const user = findUser(userId);
    return user.favorites; // Returns the array of favorite objects
  };

  addToFavorites = async (userId, movieId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);
    if (user.favorites.some((f) => f.movieId === idStr)) {
      throw new Error("The movie is already in favorites.");
    }

    const newFavorite = {
      movieId: idStr,
      comment: "",
      rating: 0,
    };

    setFavorite(user, newFavorite);
    return true;
  };

  deleteFromFavorites = async (userId, movieId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);
    const index = user.favorites.findIndex((f) => f.movieId === idStr);

    if (index === -1) throw new Error("Movie not found in favorites.");

    deleteFavorite(user, index);
    return true;
  };

  isInFavs = async (userId, movieId) => {
    try {
      const user = findUser(userId);
      if (!user) return false;
      
      const idStr = String(movieId);
      return user.favorites.some((f) => f.movieId === idStr);
    } catch (error) {
      console.error('Error checking if movie is in favorites:', error);
      return false;
    }
  };

  setRating = async (userId, movieId, rating) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const favorite = this._getFavorite(user, movieId);

    // Validate rating as a valid integer (e.g. between 0 and 5)
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      throw new Error("Rating must be an integer between 0 and 5.");
    }

    setRatingDB(favorite, rating);
    return true;
  };

  deleteRating = async (userId, favoriteId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const favorite = this._getFavoriteById(favoriteId);

    deleteRatingDB(favorite, rating);

    return true;
  };

  // --- Find favorite by ID ---
  _getFavoriteById(userId, movieId) {
    const user = findUser(userId);
    const idStr = String(movieId);
    const favorite = user.favorites.find((f) => f.movieId === idStr);
    if (!favorite) {
      throw new Error("The movie is not in favorites.");
    }
    return favorite;
  }

  setCommentToFavorite = async (userId, movieId, comment) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const favorite = this._getFavorite(user, movieId);
    setComment(favorite, comment);
    return true;
  };

  deleteCommentFromFavorite = async (userId, movieId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const favorite = this._getFavorite(user, movieId);
    deleteComment(favorite, comment);
    return true;
  };
}

export default new FavoritesService();
