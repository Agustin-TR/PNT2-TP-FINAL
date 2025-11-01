// src/services/FavoritosService.js
import {
  findUser,
  setFavorito,
  borrarFavorito,
  setRatingDB,
  borrarRatingDB,
  borrarComentario,
  setComentario,
} from "./db"; 

class FavoritosService {
    getAllFavoritos = async (userId) => {
        // --- Buscar Todos los Favoritos
        const usuario = findUser(userId);
        return usuario.favoritos; // Retorna el array de objetos favoritos
    };
    agregarAFavoritos = async (userId, idPelicula) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const idStr = String(idPelicula);
        if (usuario.favoritos.some((f) => f.idPelicula === idStr)) {
        throw new Error("La película ya está en favoritos.");
        }

        const nuevoFavorito = {
        idPelicula: idStr,
        comentario: "",
        rating: 0,
        };

        setFavorito(usuario, nuevoFavorito);
        return true;
    };
    borrarDeFavoritos = async (userId, idPelicula) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const idStr = String(idPelicula);
        const indice = usuario.favoritos.findIndex((f) => f.idPelicula === idStr);

        if (indice === -1)
        throw new Error("La película no se encontró en favoritos.");

        borrarFavorito(usuario, indice);
        return true;
    };
    setRating = async (userId, idPelicula, rating) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const favorito = this._getFavorito(usuario, idPelicula);

        // Se recomienda validar que el rating sea un entero válido (ej: entre 0 y 5)
        if (typeof rating !== "number" || rating < 0 || rating > 5) {
        throw new Error("El rating debe ser un número entero entre 0 y 5.");
        }
        setRatingDB(favorito, rating)
        return true;
    };

    borrarRating = async (userId, favoritoId) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const favorito = this._getFavoritoById(favoritoId);
        
        borrarRatingDB(favorito, rating);

        return true;
    };

    // --- Buscar Favorito por ID ---
    _getFavoritoById(userId, idPelicula) {
        const usuario = findUser(userId);
        const idStr = String(idPelicula);
        const favorito = usuario.favoritos.find((f) => f.idPelicula === idStr);
        if (!favorito) {
        throw new Error("La película no está en favoritos.");
        }
        return favorito;
    }
    setComentarioAFavorito = async (userId, idPelicula, comentario) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const favorito = this._getFavorito(usuario, idPelicula);
        setComentario(favorito, comentario)
        return true;
    };
    borrarComentarioAFavorito = async (userId, idPelicula) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const favorito = this._getFavorito(usuario, idPelicula);
        borrarComentario(favorito, comentario)
        return true;
    };
}
export default new FavoritosService();