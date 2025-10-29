import { createRouter, createWebHistory } from "vue-router";

import Form from "./components/Form.vue";
import Table from "./components/Table.vue";

const routes = [
    { path: "/", redirect: "/Form" }, // Definicion de ruta root (ruta raiz)
    { path: "/Form", component: Form },
    { path: "/Table", component: Table },

  //Definicion del comportamiento del router ante rutas no existentes
    {path: "/:pathmatch", redirect: "/Form" },
];

const router = createRouter({
    history: createWebHistory(), // vincula el historial de navegacion en el modo que queremos ()
    routes: routes,
});

export default router;