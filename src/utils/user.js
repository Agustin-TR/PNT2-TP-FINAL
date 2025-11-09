const validateToken = () => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }
  return token;
};

export { validateToken };
