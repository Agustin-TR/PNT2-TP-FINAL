<template>
    <p>WatchList</p>
    <div>{{ movie }}</div>
</template>

<script>
import movieService from "../services/movies";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

    export default {
        name: 'Watchlist', 
        data() {
            return {
                movie : {}
            }
            
        },
        methods: {
            async getMovies(id){
                id = 1218925 
                // This is correct IF the service file uses 'export default { ... }'
                this.pelicula = await MovieService.getDetallesPelicula(id) 
            }
            },
        mounted(){
            this.getMovies()
        },
        computed: {
        },
    };
</script>

<style scoped>

</style>