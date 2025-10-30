<template>

    <h1>Iniciá sesión</h1>

    <!--Form Entry: email y password-->

    <form novalidate @submit.prevent="enviar()">
        <!--Email-->
        <div class="form-group col-8 mb-3 m-lg-3">
            <label for="Email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" v-model.trim="formData.email"
                @input="formDirty.email = true"></input>
            <div v-if="errorEmail.mostrar" class="class alert alert-danger my-2">{{ errorEmail.mensaje }}</div>
        </div>

        <!--Password-->
        <div class="form-group col-8 mb-3 m-lg-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password " class="form-control" v-model.trim="formData.password"
                @input="formDirty.password = true"></input>
            <div v-if="errorPassword.mostrar" class="class alert alert-danger my-2">{{ errorPassword.mensaje }}</div>
        </div>

        <div class="form-group col-8 mb-3 m-lg-3">
            <button class="btn btn-success my-3" :disabled="!canSend" @onclick="enviar()">Enviar</button>
            <!--disable si no esta todo completo-->
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

    <div class="form-group col-8 mb-3 m-lg-3">
        <p>
            ¿No tenés cuenta?
            <router-link to="/registro" class="text-primary text-decoration-underline">Registrate</router-link>
        </p>
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
        }
    },
    methods: {
        getInputs() {
            return {
                password: null,
                email: '',
            }
        },
        enviar() {
            const datos = { ...this.formData };
            this.dataEnviada = datos,
            this.formData = this.getInputs(); //reinicio
            this.formDirty = this.getInputs(); //reinicio
        },
        envio() {
            return Object.keys(this.dataEnviada).length === 0 ? "No hay info aún" : this.dataEnviada
        }
    },
    computed: {
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
                msg = `Ingrese un email valido por favor`;
            return {
                mensaje: msg,
                mostrar: msg != "" && this.formDirty.email,
                ok: msg == "",
            }
        },
        canSend() {
            return (this.errorPassword.ok && this.errorEmail.ok);
        },
    }
}

</script>

<style scoped></style>
