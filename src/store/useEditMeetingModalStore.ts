import { create } from 'zustand';
import type { Meeting } from '@/types/meeting';

interface EditMeetingModalState {
    isOpen: boolean;
    meeting: Meeting | null;
    onOpen: (meeting: Meeting) => void;
    onClose: () => void;
}

export const useEditMeetingModalStore = create<EditMeetingModalState>((set) => ({
    isOpen: false,
    meeting: null,
    onOpen: (meeting) => set({ isOpen: true, meeting }),
    onClose: () => set({ isOpen: false, meeting: null }),
}));
