// src/services/WatchlistService.js
import { findUser,setWatchItem, borrarWatchItem } from "./db";

class WatchlistService {
    getAllWatchlist = async (userId) => {
        const usuario = findUser(userId);
        return usuario.watchlist; // Retorna el array de objetos favoritos
    };
    agregarAWatchlist = async (userId, idPelicula) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const idStr = String(idPelicula);

        if (usuario.watchlist.includes(idStr)) {
        throw new Error("La película ya está en la watchlist.");
        }

        setWatchItem(usuario, idStr);
        return true;
    };
    eliminarDeWatchlist = async (userId, idPelicula) => {
        const usuario = findUser(userId);
        if (!usuario) throw new Error("Usuario no encontrado.");

        const idStr = String(idPelicula);
        const indice = usuario.watchlist.findIndex((id) => id === idStr);

        if (indice === -1) {
        throw new Error("La película no se encontró en la watchlist.");
        }

        borrarWatchItem(usuario, indice);
        return usuario.watchlist;
    };
}
export default new WatchlistService();
