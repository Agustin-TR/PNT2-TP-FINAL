import axios from "axios";

// 🎬 Renombramos la clase para que sea más clara
class ServicioPeliculas {
  #baseUrl = "https://api.themoviedb.org/3";
  #accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjczMjI2MGUyZGE5MGEzOGEwNzhkZDEwM2MyODRmZiIsIm5iZiI6MTc2MTgzNDI3Ni4yODEsInN1YiI6IjY5MDM3NTI0M2FjMWEzNWM4NmU5OTZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1PT2L_iOfHyAHqAgk56ERvoKF0ojmKDMwr2UOIqpI-w";
  //esto es una mala práctica hay que cargarlo desde .env

  // El constructor ahora recibe el Token de Acceso
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error("Se requiere el Token de Acceso para The Movie Database.");
    }
    this.#accessToken = accessToken;
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
      // Construimos el URL
      const url = `${this.#baseUrl}/search/movie`;

      // **1. Definimos los encabezados (headers) de la solicitud**
      // Aquí es donde incluimos el Bearer Token para la autenticación.
      const headers = {
        accept: "application/json",
        // El formato es 'Bearer' seguido del token
        Authorization: `Bearer ${this.#accessToken}`,
      };

      // **2. Definimos los parámetros de consulta (query params)**
      const params = {
        query: titulo,
        language: "es-ES", // Opcional: para resultados en español
      };

      // **3. Realizamos la solicitud**
      // Usamos `axios.get(url, config)` donde `config` incluye `headers` y `params`.
      const { data } = await axios.get(url, { headers, params });

      // La API de IMDb devuelve los resultados en la propiedad 'results'
      return data.results;
    } catch (error) {
      console.error("Error al buscar películas:", error.message);
      // Manejo de errores, puedes lanzar el error o retornar un array vacío
      throw error;
    }
  };

  /**
   * 🌟 Nuevo método para obtener la lista de películas populares.
   * Este es el método que faltaba y causaba el error.
   * @returns {Promise<Array<Object>>} Un array de resultados de películas.
   */
  getPopularMovies = async () => {
    try {
      // El endpoint para películas populares es /movie/popular
      const url = `${this.#baseUrl}/movie/popular`;

      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${this.#accessToken}`,
      };

      const params = {
        language: "es-ES", // Opcional: para resultados en español
      };

      const { data } = await axios.get(url, { headers, params });

      // Devuelve la lista de resultados
      return data.results;
    } catch (error) {
      console.error("Error al obtener películas populares:", error.message);
      throw error;
    }
  };
  /**
 * ℹ️ Obtiene los detalles completos de una película por su ID.
 * @param {number} id El ID de la película (de TMDB).
 * @returns {Promise<Object>} El objeto de detalle de la película.
 */
  getDetallesPelicula = async (id) => {
    if (!id) {
      throw new Error("Se requiere el ID de la película.");
    }

    try {
      // URL: /movie/{movie_id}
      const url = `${this.#baseUrl}/movie/${id}`;

      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${this.#accessToken}`,
      };

      const params = {
        language: "es-ES", // Opcional: para detalles en español
      };

      const { data } = await axios.get(url, { headers, params });

      return data; // Esto contendrá todos los detalles de la película
    } catch (error) {
      console.error(`Error al obtener detalles de la película ${id}:`, error.message);
      throw error;
    }
  };

  // Puedes agregar otros métodos como:
  // getDetalles = async (id) => { ... }
}

export default ServicioPeliculas;