import { create } from 'zustand';
import type { Meeting } from '@/types/meeting';

interface CompleteMeetingModalState {
    isOpen: boolean;
    meeting: Meeting | null;
    onOpen: (meeting: Meeting) => void;
    onClose: () => void;
}

export const useCompleteMeetingModalStore = create<CompleteMeetingModalState>((set) => ({
    isOpen: false,
    meeting: null,
    onOpen: (meeting) => set({ isOpen: true, meeting }),
    onClose: () => set({ isOpen: false, meeting: null }),
}));
