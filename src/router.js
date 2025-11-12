import { createRouter, createWebHistory } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Signup from "./components/Signup.vue";
import Watchlist from "./components/Watchlist.vue";
import Movie from "./components/Movie.vue";
import Compare from "./components/Compare.vue";
import Favorites from "./components/Favorites.vue";
import Profile from "./components/Profile.vue";
import NotFound from "./components/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/watchlist", component: Watchlist },
  { path: "/movies/:id", name: "Movie", component: Movie, props: true },
  { path: "/compare", component: Compare },
  { path: "/favorites", component: Favorites },
  { path: "/profile", component: Profile },

  { path: "/:pathmatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(), //
  routes: routes,
});

export default router;
