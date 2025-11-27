import { create } from 'zustand';

export interface IUser {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
