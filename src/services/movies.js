import axios from "axios";


const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const baseUrl = import.meta.env.VITE_TMDB_URL;

class MovieService {
  #baseUrl = baseUrl;
  #accessToken = accessToken;

  constructor() {
    if (MovieService.instance) {
      return MovieService.instance; // Return existing instance
    }
    if (!accessToken) throw new Error("Access token required.");
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
    MovieService.instance = this;
  }

  /**
   * Search for movies by title on IMDb.
   * @param {string} title The title of the movie to search for.
   * @returns {Promise<Array<Object>>} An array of movie results.
   */
  searchMovies = async (title) => {
    if (!title) {
      return []; // Return an empty array if no title is provided
    }

    try {
      // Build the URL
      const url = `${this.#baseUrl}/search/movie`;

      // **1. Define the request headers**
      // Include the Bearer Token for authentication
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${this.#accessToken}`,
      };

      // **2. Define the query parameters**
      const params = {
        query: title,
        language: "en-US", // Optional: results in English
      };

      // **3. Make the request**
      const { data } = await axios.get(url, { headers, params });

      // The API returns results in the 'results' property
      return data.results;
    } catch (error) {
      console.error("Error searching for movies:", error.message);
      return [];
    }
  };

  /**
   * Get the list of popular movies.
   * @returns {Promise<Array<Object>>} An array of movie results.
   */
  getPopularMovies = async () => {
    try {
      const url = `${this.#baseUrl}/movie/popular`;

      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${this.#accessToken}`,
      };

      const params = {
        language: "en-US",
      };

      const { data } = await axios.get(url, { headers, params });

      return data.results;
    } catch (error) {
      console.error("Error fetching popular movies:", error.message);
      throw error;
    }
  };

  /**
   * Get full details of a movie by its ID.
   * @param {number} id The movie ID (from TMDB).
   * @returns {Promise<Object>} The detailed movie object.
   */
  getMovieDetails = async (id) => {
    if (!id) {
      throw new Error("Movie ID is required.");
    }

    try {
      const url = `${this.#baseUrl}/movie/${id}`;

      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${this.#accessToken}`,
      };

      const params = {
        language: "en-US",
      };

      const { data } = await axios.get(url, { headers, params });

      return data;
    } catch (error) {
      console.error(`Error fetching movie details ${id}:`, error.message);
      throw error;
    }
  };

  // other methods:
}

export default new MovieService();
