import type { Socket } from "socket.io-client";
import { create } from "zustand";

export interface IUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: IUser | null;
  socket: Socket | null;
  setUser: (user: IUser | null) => void;
  setSocket: (socket: Socket | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  socket: null,
  setUser: (user) => set({ user }),
  setSocket: (socket) => set({ socket }),
  clear: () => set({ user: null }),
}));
