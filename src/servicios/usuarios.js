import axios from 'axios'

class ServicioUsuarios {
    #url;
    constructor(url) {
        this.#url =
        "https://68db27bd23ebc87faa321d8c.mockapi.io/api/nt2tp3addesso/usuarios";
    }
    getAll = async () => {
        const { data: usuarios } = await axios.get(this.#url);
        return usuarios;
    };
}
export default ServicioUsuarios;



