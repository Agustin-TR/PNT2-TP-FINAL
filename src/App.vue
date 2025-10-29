<template>
    <div class= "container-fluid">
        <div>
            <header>
                
            </header>
            <main>
                    <Nav />
                    <RouterView />
            </main>
        </div>
    </div>
</template>

<script>
    import Nav from "./components/Nav.vue";
    import Home from "./components/Home.vue";
    import Login from "./components/Login.vue";
    import Registro from "./components/Registro.vue";
    import Peliculas from "./components/Peliculas.vue";
    import PeliculaDetalle from "./components/PeliculaDetalle.vue";
    import Comparar from "./components/Comparar.vue";
    import Favoritos from "./components/Favoritos.vue";

    export default {
            name: 'app',
            components: { // lista de los componentes incluidos
                Nav,
                Home,
                Login,
                Registro,
                Peliculas,
                PeliculaDetalle, 
                Comparar,
                Favoritos,
            }
        }
</script>


<style scoped>

</style>
