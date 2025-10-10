<template>
 <section class="card">
    <div class="card-header">
        <h2>Formulario</h2>
    </div>

    <div class="card-body">
        <form novalidate @submit.prevent="enviar()">
            <!-- campo nombre-->
            <div class="form-group">
                <label for="nombre">nombre</label>
                <input id="nombre" type="text" class="form-control" placeholder="Escriba su nombre"
                    v-model.trim="formData.nombre" @input="formDirty.nombre=true">
                <div v-if="errorNombre.mostrar" class="alert alert-danger my-1">
                    {{ errorNombre.mensaje }}
                </div>
            </div>

            <!-- campo edad-->
            <div class="form-group">
                <label for="edad">edad</label>
                <input id="edad" type="number" class="form-control" placeholder="Ingrese su edad"
                    v-model.number="formData.edad" @input="formDirty.edad=true">
                <div v-if="errorEdad.mostrar" class="alert alert-danger my-1">
                    {{ errorEdad.mensaje }}
                </div>
            </div>

            <!-- campo mail-->
            <div class="form-group">
                <label for="email"> email </label>
                <input id="email" type="text" class="form-control" placeholder="Ej: tumail@algo.com"
                    v-model.trim="formData.email" @input="formDirty.email=true">
                <div v-if="errorEmail.mostrar" class="alert alert-danger my-1">
                    {{ errorEmail.mensaje }}
                </div>
            </div>

            <!--botón d envío-->
            <button type="submit" class="btn btn-success my-3" :disabled="botonEnvioDeshabilitado()">Enviar</button>

        </form>

       <hr class="my-4">
<h5 class="text-muted">📚 Lista de personas</h5>
<div class="table-responsive">
  <table v-if="personas.length" class="table table-dark table-hover align-middle">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Edad</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, index) in personas" :key="index">
        <td>{{ p.nombre }}</td>
        <td>{{ p.email }}</td>
        <td>{{ p.edad }}</td>
      </tr>
    </tbody>
  </table>

  <h4 v-else class="alert alert-danger">No se encontraron personas</h4>
</div>

        


    </div>

</section>
</template>

<script>
export default {
  name: 'Formulario',

  data() {
    return {
      // estado local
      formData: this.getInicialData(),
      formDirty: this.getInicialData(),
      personas: [],
    };
  },
  computed: {
    // propiedades derivadas
    errorNombre() {
        let mensaje = ''
        if(!this.formData.nombre) mensaje = 'Campo requerido'
        else if(this.formData.nombre.length < 5) mensaje = 'Este campo debe poseer al menos 5 caracteres'
        else if(this.formData.nombre.length > 15) mensaje = 'Este campo debe poseer como máximo 15 caracteres'
        else if(this.formData.nombre.includes(' ')) mensaje = 'Este campo no permite espacios intermedios'

        return {
            mensaje: mensaje,
            mostrar: mensaje != '' && this.formDirty.nombre,
            ok: mensaje == ''
        }
    },
    errorEmail() {
        let mensaje = ''
        if(!this.formData.email) mensaje = 'Campo requerido'
        else if(this.formData.email.length < 5) mensaje = 'Este campo debe poseer al menos 3 caracteres'
        else if(this.formData.email.length > 30) mensaje = 'Este campo debe poseer como máximo 30 caracteres'
        else if(this.formData.email.includes(' ')) mensaje = 'Este campo no permite espacios intermedios'
        else if (!this.formData.email.includes('@')) mensaje = 'El email debe contener un "@" '
        else{
          const partes = this.formData.email.split('@')
          if (partes[1].trim() === '') mensaje = 'La parte después del @ no debe estar vacía'
        }
          
        return {
            mensaje: mensaje,
            mostrar: mensaje != '' && this.formDirty.email,
            ok: mensaje == ''
        }
    },
    errorEdad() {
        let mensaje = ''
        if(!this.formData.edad) mensaje = 'Campo requerido'
        else if(this.formData.edad < 18) mensaje = 'Debe ingresar una edad mayor a 18'
        else if(this.formData.edad > 120) mensaje = 'La edad máxima permitida es 120'

        return {
            mensaje: mensaje,
            mostrar: mensaje != '' && this.formDirty.edad,
            ok: mensaje == ''
        }
    }        
  },
  watch: {
   
  },
  methods: {
    // métodos del componente
    getInicialData() {
        return {
            nombre: null,
            email: null,
            edad: null
        }
    },
    botonEnvioDeshabilitado() {
        return !this.errorNombre.ok || !this.errorEmail.ok || !this.errorEdad.ok
    },
    enviar() {
        const nuevaPersona = {...this.formData}    // clon de la data de formData
        this.personas.push(nuevaPersona)

        this.formData = this.getInicialData()
        this.formDirty = this.getInicialData()
    }
  },
  // mounted() {},
  // unmounted() {},
};

</script>

<style scoped>
    .card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #f8f9fa;
}

.card-header {
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  padding: 1rem 1.5rem;
  border-bottom: none;
}

.card-header h3 {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 2rem;
}

.form-label {
  font-weight: 600;
  color: #343a40;
}

.form-control {
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #00c6ff;
  box-shadow: 0 0 0 0.2rem rgba(0, 198, 255, 0.25);
}

.alert {
  font-size: 0.9rem;
  border-radius: 6px;
}

button.btn-success {
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

button.btn-success:hover {
  background-color: #28a745;
}

pre {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #212529;
  overflow-x: auto;
}
</style>
