<template>
    <div class= "container-fluid">
        <div>
            <header>
                <h2>PNT2 TP Integrador</h2> 
            </header>
            <main>
                    <Nav />
                    <RouterView />
            </main>
        </div>
    </div>
</template>

<script>
    import Nav from './components/Nav.vue';
    import Form from './components/Form.vue';
    import Table from './components/Table.vue';

    export default {
            name: 'app',
            components: { // lista de los componentes incluidos
                Nav,
                Form,
                Table,
            }
        }
</script>


<style scoped>

</style>
