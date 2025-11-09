import axios from "axios";
import { getUsers, findUserByEmail, saveUser } from "./db";
import { validateToken } from "@/utils/user";

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

  register = async ({
    firstName,
    lastName,
    username,
    email,
    password,
    age,
  }) => {
    console.log("Registering user with data:", {
      firstName,
      lastName,
      username,
      email,
      password,
      age,
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

  loadAccount = async () => {
    const token = validateToken();
    try {
      const { data } = await axios.get(`${PREFIX}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to load profile.";
      throw new Error(msg);
    }
  };

  updateAccount = async (profileData) => {
    const token = validateToken();

    try {
      console.log("Updating profile with data:", profileData);
      const { data } = await axios.put(`${PREFIX}/`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile updated successfully:", data);
      return data;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile.";
      throw new Error(msg);
    }
  };

  deleteAccount = async () => {
    const token = validateToken();

    try {
      const response = await axios.delete(`${PREFIX}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete profile.";
      throw new Error(msg);
    }
  };
}

export default new AuthService();
