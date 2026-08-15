import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://spelling-unreeling-reissue.ngrok-free.dev/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default api;