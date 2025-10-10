<template>
    <section class="card">
        <div class="card-header">
            <h3>Componente Http</h3>
        </div>

        <div class="card-body">
            <button class="btn btn-primary my-3" @click="obtenerOrBorrar">
                {{ obtenerTituloVisibilidadComputada }}
            </button>

            <h2 v-if="mostrar">
                USUARIOS
            </h2>
            <h2 v-else="mostrar" class="alert alert-danger">
                No hay usuarios                
            </h2>



            <div v-show="mostrar">
                <div class="table-responsive">
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>nombre</th>
                                <th>email</th>
                                <th>telefono</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(usuario, index) in usuarios" :key="index">
                                <td>{{ usuario.id }}</td>
                                <td>{{ usuario.nombre }}</td>
                                <td>{{ usuario.email }}</td>
                                <td>{{ usuario.telefono }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>


<script>
import ServicioUsuarios from '../servicios/usuarios'
export default {
    name: 'http',
    
    /* ----- Hooks de ciclo de vida ---- */
    mounted() {
        console.warn('Componente Http montado')
        //this.obtener()
    },
    unmounted() {
        console.error('Componente Http desmontado')
    },
    /* ------------------------------- */

    data() {
        return {
            servicioUsuarios: new ServicioUsuarios(),
            usuarios: [],
            mostrar: false,
        }
    },
    methods: {
        async obtener() {
            const usuarios = await this.servicioUsuarios.getAll()
            this.usuarios = usuarios
        },
         obtenerOrBorrar() {
            this.mostrar = !this.mostrar
            if(this.mostrar) this.obtener()
        },
    },

    computed: {
        obtenerTituloVisibilidadComputada() {
            return this.mostrar? 'Ocultar' : 'Obtener'
        },
        obtenerTituloTabla(){
            return this.mostrar? 'USUARIOS' : ''
        }
    }
}
</script>


<style scoped>
.card-header {
    background-color: seagreen;
    color: white;
}

.table th {
    text-transform: uppercase;
    font-size: 20px;
}

</style>