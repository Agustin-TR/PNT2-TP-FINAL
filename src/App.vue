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

    export default {
            name: 'app',
            components: {
                Nav,
            }
        }
</script>


<style scoped>
body {
  margin: 0;
  padding: 0;
}
main {
    padding-top: 8vh;
}
</style>
