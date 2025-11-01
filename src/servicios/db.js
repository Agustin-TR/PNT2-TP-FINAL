import datosUsuarios from "./usuarios.json";

export const getUsuarios = () => datosUsuarios;
export const findUser = (userId) => datosUsuarios.find((u) => u.id === userId);
export const findUserByEmail = (email) => datosUsuarios.find((u) => u.email === email);
export const saveUser = (newUser) => {datosUsuarios.push(newUser);
};

export const setFavorito = (usuario, nuevoFavorito) => {
  if (usuario && usuario.favoritos) {
    usuario.favoritos.push(nuevoFavorito);
  }
};

export const borrarFavorito = (usuario, indice) => {
  if (
    usuario &&
    usuario.favoritos &&
    indice >= 0 &&
    indice < usuario.favoritos.length
  ) {
    usuario.favoritos.splice(indice, 1);
  }
};

export const setRatingDB = (favorito, rating) => {
  if (favorito) {
    favorito.rating = rating;
  }
};

export const borrarRatingDB = (favorito) => {
  if (favorito) {
    favorito.rating = 0;
  }
};

export const setComentario = (favorito, comentario) => {
  if (favorito) {
    favorito.comentario = comentario;
  }
};

export const borrarComentario = (favorito) => {
  if (favorito) {
    favorito.comentario = "";
  }
};

export const setWatchItem = (usuario, idStr) => {
  if (usuario && usuario.watchlist) {
    usuario.watchlist.push(idStr);
  }
};

export const borrarWatchItem = (usuario, indice) => {
  if (
    usuario &&
    usuario.watchlist &&
    indice >= 0 &&
    indice < usuario.watchlist.length
  ) {
    usuario.watchlist.splice(indice, 1);
  }
};

