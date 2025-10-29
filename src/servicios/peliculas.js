import axios from "axios";

// 🎬 Renombramos la clase para que sea más clara
class ServicioPeliculas {
  #baseUrl = "https://api.themoviedb.org/3";
  #apiKey; // Para almacenar tu clave de API

  // El constructor ahora recibe la clave de API
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Se requiere la clave de API de IMDb.");
    }
    this.#apiKey = apiKey;
  }

  /**
   * Busca películas por título en IMDb.
   * @param {string} titulo El título de la película a buscar.
   * @returns {Promise<Array<Object>>} Un array de resultados de películas.
   */
  buscarPeliculas = async (titulo) => {
    if (!titulo) {
      return []; // Retorna un array vacío si no hay título
    }

    try {
      // Construimos el URL con la clave y el título codificado
      const url = `${this.#baseUrl}/search/movie`;

      const params = {
        api_key: this.#apiKey,
        query: titulo,
        language: "es-ES", // Opcional: para resultados en español
      };

      const { data } = await axios.get(url, { params });

      // La API de IMDb devuelve los resultados en la propiedad 'results'
      return data.results;
    } catch (error) {
      console.error("Error al buscar películas:", error.message);
      // Manejo de errores, puedes lanzar el error o retornar un array vacío
      throw error;
    }
  };

  // Puedes agregar otros métodos como:
  // getDetalles = async (id) => { ... }
}

export default ServicioPeliculas;
