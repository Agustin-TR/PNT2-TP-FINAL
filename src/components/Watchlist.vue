<template>
    <p>WatchList</p>
    <div>{{ pelicula }}</div>
</template>

<script>
import movieService from "../services/movies";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

    export default {
        name: 'Watchlist', // 🔑 Cambiamos el nombre del componente
        data() {
            return {
                pelicula : {}
            }
            
        },
        methods: {
            async getPeliculas(id){
                id = 1218925 
                // This is correct IF the service file uses 'export default { ... }'
                this.pelicula = await MovieService.getDetallesPelicula(id) 
            }
            },
        mounted(){
            this.getPeliculas()
        },
        computed: {
        },
    };
</script>

<style scoped>

</style>