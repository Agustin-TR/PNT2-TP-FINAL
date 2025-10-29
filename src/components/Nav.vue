<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">🏠 Inicio</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/form">📋Form</RouterLink>
            </li>
            <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/table">🔎Usuarios</RouterLink>
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
