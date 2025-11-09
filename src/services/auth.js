import axios from "axios";
import { getUsers, findUserByEmail, saveUser } from "./db";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const PREFIX = URL + "/users";

let nextId = 7;

class AuthService {
  login = async (email, password, rememberMe) => {
    console.log("Trying to log in user with email and password:", {
      email,
      password,
      rememberMe,
    });

    try {
      const { data } = await axios.post(`${PREFIX}/login`, {
        email,
        password,
        rememberMe,
      });
      const storage = rememberMe ? localStorage : sessionStorage;
      const other = rememberMe ? sessionStorage : localStorage;

      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
      other.removeItem("token");
      other.removeItem("user");
      return data.user;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed.";
      throw new Error(msg);
    }
  };

  register = async ({ firstName, lastName, username, email, password }) => {
    console.log("Registering user with data:", {
      firstName,
      lastName,
      username,
      email,
      password,
    });

    const body = {
      firstName,
      lastName,
      username,
      email,
      password,
      age,
    };

    try {
      const response = await axios.post(`${PREFIX}/register`, body);
      console.log("Registration response:", response);

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed.";
      throw new Error(msg);
    }
  };
}

export default new AuthService();
