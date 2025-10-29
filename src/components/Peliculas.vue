<template>
    <section class="containerd mt-2">
        <div class="text-start mt-2 mb-2 d-flex">
            <input 
                type="text" 
                v-model="tituloBusqueda" 
                placeholder="Escribe el título de la película a buscar..."
                class="form-control me-2"
                @keyup.enter="buscarPeliculas"
            >
            <button class="btn btn-primary" @click="buscarPeliculas">Buscar</button>
        </div>
        
        <div v-if="noFetch" class="alert alert-light col-12" role="alert"> {{ wText }}</div>
        <div v-else-if="errorCarga" class="alert alert-danger col-12" role="alert"> {{ aText }}</div>

        <table v-else class="table table-striped table-hover table-responsive">
            <caption>Última actualización: {{ tStamp }}</caption>
            <thead class="table-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Título</th>
                    <th scope="col">Lanzamiento</th>
                    <th scope="col">Descripción (Fragmento)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(pelicula, index) in paginatedPeliculas" :key="pelicula.id">
                    <td>{{ pelicula.id }}</td>
                    <td>{{ pelicula.title }}</td>
                    <td>{{ pelicula.release_date }}</td>
                    <td>{{ pelicula.overview.substring(0, 80) + '...' }}</td>
                </tr>
            </tbody>
        </table>

        <nav v-if="peliculas.length > pageSize" aria-label="Page navigation example" class="pagination mt-2">
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
    import ServicioPeliculas from '../servicios/peliculas'; // 🔑 Importar el nuevo servicio

    // 🔑 Mueve la clave de API aquí
    const MI_CLAVE_TMDB = 'a1aff9890766e23ec3b7e0701b10fa2c'; // ¡REEMPLAZA ESTO!

    export default {
        name: 'BuscadorPeliculas', // 🔑 Cambiamos el nombre del componente
        data() {
            return {
                noFetch: true,
                errorCarga: false,
                tStamp: '',
                // 🔑 Textos adaptados
                wText: "ℹ️ Escribe un título y haz click en Buscar para usar la API de TMDB.",
                aText: "🚨 Algo falló al buscar las películas. Revisa tu clave de API o la conexión.",
                // 🔑 Cambiamos el servicio y lo inicializamos con la clave
                servPeliculas: new ServicioPeliculas(MI_CLAVE_TMDB), 
                // 🔑 Estado para el input de búsqueda
                tituloBusqueda: 'Matrix', 
                // 🔑 Cambiamos la variable de almacenamiento de datos
                peliculas: [],
                currentPage: 1,
                pageSize: 10,
            }
        },
        methods: {
            // 🔑 Renombramos el método y adaptamos la lógica
            async buscarPeliculas(){
                // Limpia la paginación al buscar algo nuevo
                this.currentPage = 1;

                try{
                    // 🔑 Llamada al método buscarPeliculas del servicio
                    const resultados = await this.servPeliculas.buscarPeliculas(this.tituloBusqueda);
                    
                    console.log(resultados);
                    
                    this.peliculas = resultados; // 🔑 Guardamos los resultados en la variable 'peliculas'
                    this.noFetch = false;
                    this.errorCarga = false; // Aseguramos que el error se borre
                    this.tStamp = this.getTimestamp();
                }
                catch(e){
                    console.error("Error al buscar películas:", e);
                    this.noFetch = false;
                    this.errorCarga = true;
                    this.peliculas = []; // Limpia la lista al haber un error
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
            // 🔑 Adaptamos el computed para la paginación
            paginatedPeliculas() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                // 🔑 Usamos 'peliculas' en lugar de 'usuarios'
                return this.peliculas.slice(start, end); 
            },
            totalPages() {
                // 🔑 Usamos 'peliculas' en lugar de 'usuarios'
                return Math.ceil(this.peliculas.length / this.pageSize); 
            }
        },
        // 🔑 Opcional: Llamar a la búsqueda al cargar el componente con un valor inicial
        mounted() {
            this.buscarPeliculas(); 
        }
    };
</script>

<style scoped>

</style>

<style scoped>

</style>