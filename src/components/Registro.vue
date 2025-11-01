<template>
    <!--Form Entry: Nombre, apellido, email y password-->
    <h1>Creá tu cuenta</h1>

    <form novalidate @submit.prevent="enviar()">

        <!--Nombre-->
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Nombre" class="form-label" >Nombre</label>
            <input type="text" id="nombre" class="form-control" v-model.trim="formData.nombre" @input ="formDirty.nombre=true"></input>
            <div v-if="errorNombre.mostrar" class="class alert alert-danger my-2">{{errorNombre.mensaje}}</div>
        </div>
        
        <!--Apellido-->
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Apellido" class="form-label" >Apellido</label>
            <input type="text" id="apellido" class="form-control" v-model.trim="formData.apellido" @input ="formDirty.apellido=true"></input>
            <div v-if="errorApellido.mostrar" class="class alert alert-danger my-2">{{errorApellido.mensaje}}</div>
        </div>
        
        <!--Email-->
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Email" class="form-label" >Email</label>
            <input type="email" id="email" class="form-control" v-model.trim="formData.email" @input ="formDirty.email=true"></input>
            <div v-if="errorEmail.mostrar" class="class alert alert-danger my-2">{{errorEmail.mensaje}}</div>
        </div>

        <!--Password-->
        <div class="form-group col-8 mb-3 m-lg-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password " class="form-control" v-model.trim="formData.password"
                @input="formDirty.password = true"></input>
            <div v-if="errorPassword.mostrar" class="class alert alert-danger my-2">{{ errorPassword.mensaje }}</div>
        </div>
        
        <div class="form-group col-8 mb-3 m-lg-3">
            <button class="btn btn-success my-3" :disabled="!canSend" @onclick="enviar()">Enviar</button> <!--disable si no esta todo completo-->
        </div>
    </form> 
    <!--Form Show-->
    <div class="card shadow-sm mt-4 col-8 mb-3 m-lg-3" v-show="Object.keys(dataEnviada).length > 0">
        <div class="card-body">
            <h5 class="card-title mb-3 text-dark">📮 Información Enviada</h5>
            <ul>
                <li v-for="(value, key) in envio()" :key="key">
                    <strong>{{ key }}:</strong> {{ value }}
                </li>
            </ul>
        </div>
    </div>

</template>

<script scoped>
import AuthService from '@/servicios/AuthService';
    export default {
        name: 'Form',
        data() {
            return {
                formData: this.getInputs(),
                formDirty: this.getInputs(),
                dataEnviada: {},
                charsMinNombre: 5,
                charsMaxNombre: 15,
            }
        },
        methods: {
            getInputs(){
                return {
                    nombre: null,
                    apellido: null,
                    email: '',
                    password: null,
                }
            },
            async enviar() {
                // Cláusula de guardia
                if (!this.canSend) {
                    this.serverError = "Por favor, completa y corrige todos los campos.";
                    return;
                }
                
                this.isLoading = true;
                this.serverError = '';
                
                const datos = { ...this.formData }; // Copia superficial de los datos

                try {
                    // Llamada al servicio de registro (asíncrona)
                    const nuevoUsuario = await AuthService.registro(datos);
                    
                    // Éxito
                    this.dataEnviada = nuevoUsuario;
                    this.formData = this.getInputs(); // reinicio
                    this.formDirty = this.getInputs(); // reinicio
                    
                    // Opcional: Mostrar mensaje de éxito o redirigir
                    alert(`¡Registro exitoso! Usuario: ${nuevoUsuario.email}`);

                } catch (error) {
                    // Capturar el error lanzado por AuthService (ej: "El email ya está registrado.")
                    this.serverError = error.message || "Error desconocido al intentar registrar.";
                    
                } finally {
                    this.isLoading = false;
                }
            },
            envio() {
                return Object.keys(this.dataEnviada).length === 0? "No hay info aún": this.dataEnviada
            }
        },
        computed: {
            errorNombre() {
                let msg = "";
                if (!this.formData.nombre) msg = "Este campo es requerido";
                else if (this.formData.nombre.length < this.charsMinNombre)
                    msg = `El nombre no puede tener menos de ${this.charsMinNombre} caracteres`;
                else if (this.formData.nombre.length > this.charsMaxNombre)
                    msg = `El nombre no puede tener más de ${this.charsMaxNombre} caracteres`;
                return {
                    mensaje: msg,
                    mostrar: msg != "" && this.formDirty.nombre,
                    ok: msg == "",
                }
            },
              errorApellido() {
                let msg = "";
                if (!this.formData.apellido) msg = "Este campo es requerido";
                else if (this.formData.apellido.length < this.charsMinApellido)
                    msg = `El apellido no puede tener menos de ${this.charsMinNombre} caracteres`;
                else if (this.formData.apellido.length > this.charsMaxapellido)
                    msg = `El apellido no puede tener más de ${this.charsMaxNombre} caracteres`;
                return {
                    mensaje: msg,
                    mostrar: msg != "" && this.formDirty.apellido,
                    ok: msg == "",
                }
            },
            errorPassword() {
                let msg = "";
                const password = this.formData.password;

                if (!password) {
                  msg = "Este campo es requerido";
                } else if (password.length < 8) {
                  msg = "Debe tener al menos 8 caracteres";
                } else if (!/[A-Z]/.test(password)) {
                  msg = "Debe incluir al menos una letra mayúscula";
                } else if (!/[a-z]/.test(password)) {
                  msg = "Debe incluir al menos una letra minúscula";
                } else if (!/[0-9]/.test(password)) {
                  msg = "Debe incluir al menos un número";
                } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
                  msg = "Debe incluir al menos un símbolo especial";
                }
            
                return {
                  mensaje: msg,
                  mostrar: msg !== "" && this.formDirty.password,
                  ok: msg === "",
                };
             },
            isValidEmail() {
                const email = this.formData.email
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return regex.test(email)
            },
            errorEmail() {
                let msg = "";
                if (!this.formData.email) msg = "Este campo es requerido";
                else if (!this.isValidEmail)
                    msg = `Ingrese un email válido por favor`;
                return {
                    mensaje: msg,
                    mostrar: msg != "" && this.formDirty.email,
                    ok: msg == "",
                }
            },
            canSend(){
                return (this.errorNombre.ok && this.errorApellido.ok && this.errorEmail.ok && this.errorPassword.ok);
                },
            }
        }
        
</script>

<style scoped>

</style>
