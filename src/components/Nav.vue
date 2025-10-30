<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">

            <div class="collapse navbar-collapse justify-content-center bg-dark navbar-dark my-0" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/Home">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/Login">Login</RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle text-white" href="#" role="button"
                            data-bs-toggle="dropdown">nombreUsuario</a>
                        <ul class="dropdown-menu">
                            <li><RouterLink class="dropdown-item" to="/Favoritos">Favoritos</RouterLink></li>
                            <li><RouterLink class="dropdown-item" to="/Comparar">Comparar</RouterLink></li>
                            <li><RouterLink class="dropdown-item" to="/Comparar">tercer link</RouterLink></li>
                        </ul>
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

<style scoped></style>
