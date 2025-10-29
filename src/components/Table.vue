<template>
    <section class="containerd mt-2">
        <div class="text-start mt-2 mb-2">
            <button class="btn btn-success" @click="obtener">Actualizar</button>
        </div>
        <div v-if="noFetch" class="alert alert-light col-8" role="alert"> {{ wText }}</div>
        <div v-else-if="errorCarga" class="alert alert-danger col-8" role="alert"> {{ aText }}</div>

        <table v-else class="table table-striped table-hover table-responsive">
            <caption>Última actualización: {{ tStamp }}</caption>
            <thead class="table-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">E-Mail</th>
                    <th scope="col">Teléfono</th>
                </tr>
            </thead>
            <tbody>
                    <tr v-for="(usuario, index) in paginatedUsuarios" :key="usuario.id">
                        <td>{{ usuario.id }}</td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.email }}</td>
                        <td>{{ usuario.tel }}</td>
                    </tr>
            </tbody>
        </table>
                <nav v-if="usuarios.length > pageSize" aria-label="Page navigation example" class="pagination mt-2">
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="currentPage--" :disabled="currentPage === 1"> Prev</button>
                        </li>  
                        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                            <button class="page-link" @click="currentPage = page">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
                        </li>
                    </ul>
                </nav>
    </section>
</template>

<script>
    import ServicioUsuarios from '../servicios/usuarios';
    export default {
        name: 'Table',
        data() {
            return {
                noFetch: true,
                errorCarga: false,
                tStamp: '',
                wText: "ℹ️ Haga click en actualizar para traer la lista de usuarios.",
                aText: "🚨 Algo falló al buscar los usuarios. Contacte a soporte.",
                servUsuarios: new ServicioUsuarios,
                usuarios: [],
                currentPage: 1,
                pageSize: 10,
            }
        },
        methods: {
            async obtener(){
                try{
                    const usuarios = await this.servUsuarios.getAll();
                    console.log(usuarios);
                    this.usuarios = usuarios;
                    this.noFetch = false;
                    this.tStamp = this.getTimestamp();
                }
                catch{
                    this.noFetch = false;
                    this.errorCarga = true;
                }
            },
            getTimestamp(){
                const fecha = new Date()
                const datos = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }
                const fechaLocal = fecha.toLocaleDateString('es-ES', datos)
                const horaLocal = fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
                return `${fechaLocal} - ${horaLocal}`
            },
        },
        computed: {
            paginatedUsuarios() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.usuarios.slice(start, end);
            },
            totalPages() {
                return Math.ceil(this.usuarios.length / this.pageSize);
            }
        }
    };
</script>

<style scoped>

</style>
