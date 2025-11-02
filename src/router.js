import { createRouter, createWebHistory } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Signup from "./components/Signup.vue";
import Watchlist from "./components/Watchlist.vue";
import Movie from "./components/Movie.vue";
import Compare from "./components/Compare.vue";
import Favorites from "./components/Favorites.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/watchlist", component: Watchlist },
  { path: "/movies/:id", name: "Movie", component: Movie },
  { path: "/compare", component: Compare },
  { path: "/favorites", component: Favorites },

  // Redirect to home for any unmatched routes
  { path: "/:pathmatch", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(), //
  routes: routes,
});

export default router;
