<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">

            <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Home">Home</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Peliculas">Peliculas</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/PeliculaDetalle">Detalle</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Comparar">Comparar</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Favoritos">Favoritos</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Login">Login</RouterLink>
                </li>
                <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/Registro">Registro</RouterLink>
                </li>
            </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'Nav',
        data() {
            return {
            }
        },
        methods: {
        },
        computed: {
        }
    }
</script>

<style scoped>

</style>
