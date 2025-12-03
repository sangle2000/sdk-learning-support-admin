import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { decrypt, encrypt } from "../utils/helper";
import { redirect } from "react-router-dom";

type PendingRequest = (token: string) => void;

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://sdk.petalsandyou.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const hashedToken = localStorage.getItem("adminAccessToken");
  if (hashedToken) {
    const token = decrypt(hashedToken);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshing = false;
let pending: PendingRequest[] = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;

        try {
          const res = await api.post("/auth/refresh", {});

          localStorage.setItem(
            "adminAccessToken",
            encrypt(res.data.accessToken)
          );

          refreshing = true;

          pending.forEach((cb) => cb(res.data.accessToken));
          pending = [];
        } catch (e) {
          refreshing = false;
          pending = [];
          useAuthStore.getState().clear();
          Promise.reject(e);
          return redirect("/login");
        }
      }

      return new Promise((resolve) => {
        pending.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(err);
  }
);

export default api;
