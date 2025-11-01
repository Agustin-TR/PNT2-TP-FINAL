import { createRouter, createWebHistory } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Registro from "./components/Registro.vue";
import Watchlist from "./components/Watchlist.vue";
import PeliculaDetalle from "./components/PeliculaDetalle.vue";
import Comparar from "./components/Comparar.vue";
import Favoritos from "./components/Favoritos.vue";

const routes = [
    {path: "/", redirect: "/Home" }, // Definicion de ruta root (ruta raiz)
    {path: "/Home", component: Home},
    {path: "/Login", component: Login}, 
    {path: "/Registro", component: Registro},
    {path: "/Watchlist", component: Watchlist},
    {path: "/PeliculaDetalle/:id", name: "PeliculaDetalle", component: PeliculaDetalle},
    {path: "/Comparar", component: Comparar},
    {path: "/Favoritos", component: Favoritos},

  //Definicion del comportamiento del router ante rutas no existentes
  { path: "/:pathmatch", redirect: "/Home" },
];

const router = createRouter({
    history: createWebHistory(), // vincula el historial de navegacion en el modo que queremos ()
    routes: routes,
});

export default router;