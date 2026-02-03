import { create } from 'zustand';

interface LoginModalStore {
  isOpen: boolean;
  redirectOnReject: string | null;
  message: string | null; // For session expiry or other notifications
  onOpen: (options?: { redirectOnReject?: string; message?: string }) => void;
  onClose: () => void;
}

export const useLoginModalStore = create<LoginModalStore>((set) => ({
  isOpen: false,
  redirectOnReject: null,
  message: null,
  onOpen: (options) => set({
    isOpen: true,
    redirectOnReject: options?.redirectOnReject || null,
    message: options?.message || null
  }),
  onClose: () => set({ isOpen: false, redirectOnReject: null, message: null }),
}));
