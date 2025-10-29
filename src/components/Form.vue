<template>
    <!--Form Entry: Nombre, edad e email-->

    <!--Nombre-->
    <form novalidate @submit.prevent="enviar()">
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Nombre" class="form-label" >Nombre</label>
            <input type="text" id="nombre" class="form-control" v-model.trim="formData.nombre" @input ="formDirty.nombre=true"></input>
            <div v-if="errorNombre.mostrar" class="class alert alert-danger my-2">{{errorNombre.mensaje}}</div>
        </div>
        
        <!--Edad-->
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Edad" class="form-label" >Edad</label>
            <input type="number" id="edad" class="form-control" v-model.trim="formData.edad" @input ="formDirty.edad=true"></input>
            <div v-if="errorEdad.mostrar" class="class alert alert-danger my-2">{{errorEdad.mensaje}}</div>
        </div>
        
        <!--Email-->
        <div class="form-group col-8 mb-3 m-lg-3"> 
            <label for="Email" class="form-label" >Email</label>
            <input type="email" id="email" class="form-control" v-model.trim="formData.email" @input ="formDirty.email=true"></input>
            <div v-if="errorEmail.mostrar" class="class alert alert-danger my-2">{{errorEmail.mensaje}}</div>
        </div>
        
        <div class="form-group col-8 mb-3 m-lg-3">
            <button class="btn btn-success my-3" :disabled="canSend" @onclick="enviar()">Enviar</button> <!--disable si no esta todo completo-->
        </div>
    </form>
    <!--Form Show: Nombre, edad e email-->
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
    export default {
        name: 'Form',
        data() {
            return {
                formData: this.getInputs(),
                formDirty: this.getInputs(),
                dataEnviada: {},
                edadMinima: 18,
                edadMaxima: 120,
                charsMinNombre: 5,
                charsMaxNombre: 15,
            }
        },
        methods: {
            getInputs(){
                return {
                    nombre: null,
                    edad: null,
                    email: '',
                }
            },
            enviar() {
                const datos = { ...this.formData };
                this.dataEnviada = datos,
                //console.log("🧉 Form ➡️ ", datos)
                //console.log("🧉 Dirty ➡️ ",this.formDirty)
                this.formData = this.getInputs(); //reinicio
                this.formDirty = this.getInputs(); //reinicio
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
            errorEdad() {
                let msg = "";
                if (!this.formData.edad) msg = "Este campo es requerido";
                else if (this.formData.edad < this.edadMinima)
                    msg = "Debe ser mayor a 18 años";
                else if (this.formData.edad >= this.edadMaxima)
                    msg = "Debe ser menor a 120 años";
                return {
                    mensaje: msg, //Envio el mensaje
                    mostrar: msg != "" && this.formDirty.edad,
                    ok: msg == "",
                }
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
                    msg = `Ingrese un email valido por favor`;
                return {
                    mensaje: msg,
                    mostrar: msg != "" && this.formDirty.email,
                    ok: msg == "",
                }
            },
            canSend(){
                return (!this.errorNombre.ok || !this.errorEdad.ok || !this.errorEmail.ok);
                },
            }
        }
        
</script>

<style scoped>

</style>
