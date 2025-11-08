import userData from "./users.json";
export const getUsers = () => userData;
export const findUser = (userId) => userData.find((u) => u.id === userId);
export const findUserByEmail = (email) =>
  userData.find((u) => u.email === email);

export const saveUser = (newUser) => {
  userData.push(newUser);
};

export const setFavorite = (user, newFavorite) => {
  if (user && user.favorites) {
    user.favorites.push(newFavorite);
    console.log("Favorite added");
  }
};

export const deleteFavorite = (user, index) => {
  if (user && user.favorites && index >= 0 && index < user.favorites.length) {
    user.favorites.splice(index, 1);
    console.log("Favorite deleted");
  }
};

export const setRatingDB = (favorite, rating) => {
  if (favorite) {
    favorite.rating = rating;
    console.log("Rating added");
  }
};

export const deleteRatingDB = (favorite) => {
  if (favorite) {
    favorite.rating = 0;
    console.log("Rating deleted");
  }
};

export const setComment = (favorite, comment) => {
  if (favorite) {
    favorite.comment = comment;
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
