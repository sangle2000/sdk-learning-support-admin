import { create } from 'zustand';

interface IUser {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    accessToken: string | null;
    user: IUser | null;
    setAccessToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clear: () => set({ accessToken: null, user: null }),
}));
