import { getUsers, findUserByEmail, saveUser } from "./db";

let nextId = 7; 

class AuthService {
  login = async (email, password) => {
    console.log("Trying to log in user with email and password:", {
      email,
      password,
    });
    const user = findUserByEmail(email);
    console.log("Found user:", user);
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.password === password) {
      return user;
    } else {
      throw new Error("Incorrect password.");
    }
  };

  register = async ({ firstName, lastName, email, password }) => {

    console.log("Registering user with data:", { firstName, lastName, email, password });

    if (findUserByEmail(email)) {
      throw new Error("Email is already registered.");
    }

    const newUser = {
      id: nextId++, // Use and then increment nextId
      firstName,
      lastName,
      email,
      password,
      favorites: [],
      watchlist: [],
    };

    // Save through the DB layer
    saveUser(newUser);
    return newUser;
  };
}

export default new AuthService();
