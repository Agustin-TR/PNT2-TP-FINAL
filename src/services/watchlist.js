import { useAuthStore } from "@/stores/authStore";

class WatchlistService {
  getAllWatchlist = async () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");
    return user.watchlist || [];
  };
  getWatchlistCount = async () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");
    return user.watchlist ? user.watchlist.length : 0;
  }
  resetWatchlist = async () => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    user.watchlist = [];
    this._updateUser(authStore, user);
    return true
  };

  addToWatchlist = async (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);

    if (!user.watchlist) user.watchlist = [];
    if (user.watchlist.includes(idStr)) {
      throw new Error("The movie is already in the watchlist.");
    }

    user.watchlist.push(idStr);
    this._updateUser(authStore, user);
    return user.watchlist;
  };

  isInWatchlist = (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);
    return user.watchlist?.includes(idStr) || false;
  };

  removeFromWatchlist = async (movieId) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) throw new Error("User not found.");

    const idStr = String(movieId);
    const index = user.watchlist?.indexOf(idStr);

    if (index === -1 || index === undefined) {
      throw new Error("The movie was not found in the watchlist.");
    }

    user.watchlist.splice(index, 1);
    this._updateUser(authStore, user);
    return user.watchlist;
  };

  // 🔒 helper method to persist user updates in storage
  _updateUser(authStore, user) {
    authStore.user = user;
    if (localStorage.getItem("token")) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }
}

export default new WatchlistService();