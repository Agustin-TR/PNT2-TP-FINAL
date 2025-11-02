<template>
    <p>WatchList</p>
    <div>{{ movie }}</div>
</template>

<script>

    import movieService from '../services/movies';

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
                this.movie = await movieService.getMovieDetails(id) 
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