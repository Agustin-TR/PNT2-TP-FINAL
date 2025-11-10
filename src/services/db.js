import userData from "./users.json";
export const getUsers = () => userData;
export const findUser = (userId) => userData.find((u) => u.id === userId);
export const findUserByEmail = (email) =>
  userData.find((u) => u.email === email);

export const saveUser = (newUser) => {
  userData.push(newUser);
};

export const setFavorite = (user, newFavorite) => {
  user.favorites.push(newFavorite);
  console.log("Favorite added");
}

export const deleteFavorite = (user, index) => {
  if (user && user.favorites && index >= 0 && index < user.favorites.length) {
    user.favorites.splice(index, 1);
    console.log("Favorite deleted");
  }
};

/*export const setRatingDB = (favorite, rating) => {
  if (favorite) {
    favorite.rating = rating;
    console.log("Rating added");
  }
};*/

export const setRatingDB = (user, movieId, rating) => {
  if (!user) return;
  if (rating < 1 || rating > 5) {
    console.error("Rating must be between 1 and 5");
    return;
  }

  const existingRating = user.ratings.find(r => r.movieId === movieId);

  if (existingRating) {
    // Actualizar rating existente
    existingRating.rating = rating;
    console.log("Rating updated");
  } else {
    // Agregar nuevo rating
    user.ratings.push({
      movieId: movieId,
      rating: rating
    });
    console.log("Rating added");
  }  

};

export const deleteRatingDB = (favorite) => {
  if (favorite) {
    favorite.rating = 0;
    console.log("Rating deleted");
  }
};

/*export const setComment = (favorite, comment) => {
  if (favorite) {
    favorite.comment = comment;
    console.log("Comment added");
  }
};*/

export const setComment = (user, movieId, commentText) => {
  if (!user) return;

  // Buscar si ya existe un comentario para esta película
  const existingComment = user.comments.find(c => c.movieId === movieId);

  if (existingComment) {
    // Actualizar comentario existente
    existingComment.comment = commentText.trim();
    existingComment.updated_at = new Date().toISOString();
    console.log("Comment updated");
  } else {
    // Agregar nuevo comentario
    user.comments.push({
      movieId: movieId,
      comment: commentText.trim(),
      created_at: new Date().toISOString()
    });
    console.log("Comment added");
  }  

};

export const deleteComment = (favorite) => {
  if (favorite) {
    favorite.comment = "";
    console.log("Comment deleted");
  }
};

export const setWatchItem = (user, idStr) => {
  if (user && user.watchlist) {
    user.watchlist.push(idStr);
    console.log("Watch item added");
  }
};

export const deleteWatchItem = (user, index) => {
  if (user && user.watchlist && index >= 0 && index < user.watchlist.length) {
    user.watchlist.splice(index, 1);
    console.log("Watch item deleted");
  }
};

// For testing in the browser
window.userData = userData;

window.getUsers = getUsers; // returns all users from the .json file
window.findUser = findUser; // find user by id
window.findUserByEmail = findUserByEmail; // find user by email

// These functions can be tested directly from the browser console
window.setFavorite = setFavorite;
window.deleteFavorite = deleteFavorite;
window.setRatingDB = setRatingDB;
window.deleteRatingDB = deleteRatingDB;
window.setComment = setComment;
window.deleteComment = deleteComment;
window.setWatchItem = setWatchItem;
window.deleteWatchItem = deleteWatchItem;
