import axios from 'axios';
import { useAuthStore } from "../stores/auth";

const api = axios.create({
    baseURL: "https://sdk.petalsandyou.com",
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

let refreshing = false;
let pending: any[] = [];

api.interceptors.response.use(
    (res) => res, 
    async (err) => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (!refreshing) {
                refreshing = true;

                try {
                    const res = await api.post("/auth/refresh", {
                        refreshToken: useAuthStore.getState().accessToken,
                    });
                    useAuthStore.getState().setAccessToken(res.data.accessToken);
                } catch {
                    console.log("Error")
                }
            }
        }
    }
)
