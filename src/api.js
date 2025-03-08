import axios from "axios";

const API_URL = "http://localhost:5157/api";

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 401) {
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(`${API_URL}/users/refresh-token`, { refreshToken });
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);

                error.config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
                return axios(error.config);
            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/admin/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
