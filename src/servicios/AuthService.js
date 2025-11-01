    import { getUsuarios, findUserByEmail, saveUser } from './db'; 

    // Simula la logica de Id incremental de la DB. Removar luego de integrar DB
    let nextId = 7 /*getUsuarios.length > 0  ? Math.max(...getUsuarios.map((u) => u.id)) + 1 : 1;*/

    class AuthService {
        login = async (email, password) => { 
                const usuario = findUserByEmail(email);
                if (!usuario) { // User not found
                    throw new Error("Usuario no encontrado.");
                }
                if (usuario.password === password) {
                    return usuario;
                } else {
                    throw new Error("Contraseña incorrecta.");
                }
                
            };
    registro = async ({ nombre, apellido, email, password }) => { 
        
        // CORRECCIÓN LÓGICA: Si encuentra un usuario por email (existe), lanza el error.
        if (findUserByEmail(email)) {
            throw new Error("El email ya está registrado.");
        }

        const nuevoUsuario = {
            id: nextId++, // Usa y luego incrementa nextId
            nombre,
            apellido,
            email,
            // NOTA: Aquí se debería HASHEAR la contraseña con bcrypt una vez interado el backend
            password, 
            favoritos: [],
            watchlist: [],
        };

        // CORRECCIÓN DE DISEÑO: Llama a la función de la capa de DB para guardar
        saveUser(nuevoUsuario); 
        return nuevoUsuario;
    };
    }
    export default new AuthService();
