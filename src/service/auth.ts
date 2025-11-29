import api from "../lib/axios";
import { useAuthStore } from "../stores/auth";
import { encrypt } from "../utils/helper";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login-admin", { email, password });

  if (res.data.accessToken) {
    // Backend trả về accessToken trong body
    const hashedAccessToken = encrypt(res.data.accessToken);

    localStorage.setItem("accessToken", hashedAccessToken);

    // Lấy thông tin user
    const me = await api.get("/auth/me");
    useAuthStore.getState().setUser(me.data);

    return me.data;
  }

  throw new Error("Login Error: ", res.data.message)
}

export async function logout() {
  await api.post("/auth/logout");
  useAuthStore.getState().clear();
  localStorage.removeItem("accessToken");
}

export async function loadUserFromRefresh() {
  try {
    const me = await api.get("/auth/me");

    useAuthStore.getState().setUser(me.data);
  } catch {
    useAuthStore.getState().clear();
  }
}

export async function createUser(name: string, email: string, role?: string) {
  try {
    const newUser = await api.post("/auth/create-user", {
      email,
      name,
      role
    })

    console.log(newUser)
  } catch (err) {
    throw new Error(err)
  }
}
