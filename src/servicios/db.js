import datosUsuarios from "./usuarios.json";

export const getUsuarios = () => datosUsuarios;
export const findUser = (userId) => datosUsuarios.find((u) => u.id === userId);
export const findUserByEmail = (email) => datosUsuarios.find((u) => u.email === email);
export const saveUser = (newUser) => {datosUsuarios.push(newUser);
};

export const setFavorito = (usuario, nuevoFavorito) => {
  if (usuario && usuario.favoritos) {
    usuario.favoritos.push(nuevoFavorito);
      console.log("Favorito agregado");
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
    console.log("Favorito borrado");
  }
};

export const setRatingDB = (favorito, rating) => {
  if (favorito) {
    favorito.rating = rating;
    console.log("Rating agregado");
  }
};

export const borrarRatingDB = (favorito) => {
  if (favorito) {
    favorito.rating = 0;
    console.log("Rating borrado");
  }
};

export const setComentario = (favorito, comentario) => {
  if (favorito) {
    favorito.comentario = comentario;
    console.log("Comentario agregado");
  }
};

export const borrarComentario = (favorito) => {
  if (favorito) {
    favorito.comentario = "";
    console.log("Comentario borrado");
  }
};

export const setWatchItem = (usuario, idStr) => {
  if (usuario && usuario.watchlist) {
    usuario.watchlist.push(idStr);
    console.log("Watch item agregado");
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
        console.log("Watch item borrado");
  }
};

// Para realizar pruebas en el navegador
window.datosUsuarios = datosUsuarios;

window.getUsuarios = getUsuarios; // trae todos los usuarios de .db
window.findUser = findUser; // buscar un usuario por id
window.findUserByEmail = findUserByEmail; // buscar un usuario por email

// Todos estos hay que modificar las funciones que estan mas arriba para que no esperen un objeto sinó un parámetro tipo int o string
window.setFavorito = borrarFavorito;
window.setRatingDB = setRatingDB;
window.borrarRatingDB = borrarRatingDB;
window.setComentario = setComentario;
window.borrarComentario = borrarComentario;
window.setWatchItem = setWatchItem;
window.borrarWatchItem = borrarWatchItem;
