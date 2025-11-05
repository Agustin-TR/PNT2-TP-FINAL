import { findUser, setWatchItem, deleteWatchItem } from "./db";

class WatchlistService {
  getAllWatchlist = async (userId) => {
    const user = findUser(userId);
    return user.watchlist; // Returns the array of watchlist items
  };

  addToWatchlist = async (userId, movieId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);

    if (user.watchlist.includes(idStr)) {
      throw new Error("The movie is already in the watchlist.");
    }

    setWatchItem(user, idStr);
    return true;
};

isInWatchlist = async (userId, movieId) => {
        const user = findUser(userId);
        if (!user) throw new Error("User not found.");

        const idStr = String(movieId);
        if (!user.watchlist.includes(idStr)) {
            return false;
        } else {
            return true;
        }
    };

  removeFromWatchlist = async (userId, movieId) => {
    const user = findUser(userId);
    if (!user) throw new Error("User not found.");
    const idStr = String(movieId);

    const index = user.watchlist.findIndex((id) => id === idStr);

    if (index === -1) {
      throw new Error("The movie was not found in the watchlist.");
    }

    deleteWatchItem(user, index);
    return user.watchlist;
  };
}

export default new WatchlistService();
