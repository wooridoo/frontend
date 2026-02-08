import { create } from 'zustand';
import type { Post } from '@/types/feed';

interface PostDetailModalState {
    isOpen: boolean;
    post: Post | null;
    onOpen: (post: Post) => void;
    onClose: () => void;
}

export const usePostDetailModalStore = create<PostDetailModalState>((set) => ({
    isOpen: false,
    post: null,
    onOpen: (post) => set({ isOpen: true, post }),
    onClose: () => set({ isOpen: false, post: null }),
}));
