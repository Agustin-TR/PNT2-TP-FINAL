// axios: cliente http
// https://www.npmjs.com/package/axios
// https://github.com/axios/axios
// https://axios-http.com/

import axios from "axios"

class ServicioUsuarios {
    #url

    constructor() {
        this.#url = 'https://68e86a3bf2707e6128cac7b4.mockapi.io/usuarios'
    }

    getAll = async () => {

        try {
            const { data:usuarios } = await axios.get(this.#url)      // Object Destructuring con alias
            return usuarios
        }
        catch(error) {
            console.error(error)
        }
    }
}

export default ServicioUsuarios