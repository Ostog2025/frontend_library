import axios from "axios";

const apiUrl = "https://backend-library-0o7f.onrender.com/api";

const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

export default api;
