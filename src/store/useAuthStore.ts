import { create } from 'zustand';

interface User {
  name: string;
  avatar: string;
  sugarScore: number;
  balance: number;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
}

const DUMMY_USER: User = {
  name: '김우리',
  avatar: 'https://i.pravatar.cc/150?u=woorido',
  sugarScore: 72,
  balance: 154000
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (userData) => set({
    isLoggedIn: true,
    user: userData || DUMMY_USER
  }),
  logout: () => set({
    isLoggedIn: false,
    user: null
  }),
}));
