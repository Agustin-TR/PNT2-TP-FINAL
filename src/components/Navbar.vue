<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-1">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">Inicio</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/formulario">Formulario</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/http">Http</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script>
export default {
    name: '',
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