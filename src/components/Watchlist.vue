<template>
    <div>{{ pelicula }}</div>
</template>

<script>
import ServicioPeliculas from '@/servicios/peliculas';

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjczMjI2MGUyZGE5MGEzOGEwNzhkZDEwM2MyODRmZiIsIm5iZiI6MTc2MTgzNDI3Ni4yODEsInN1YiI6IjY5MDM3NTI0M2FjMWEzNWM4NmU5OTZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1PT2L_iOfHyAHqAgk56ERvoKF0ojmKDMwr2UOIqpI-w";

const peliculasService = new ServicioPeliculas(ACCESS_TOKEN);

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
                this.pelicula = await ServicioPeliculas.getDetallesPelicula(id) 
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