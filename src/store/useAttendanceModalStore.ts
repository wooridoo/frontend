import { create } from 'zustand';
import type { Meeting } from '@/types/meeting';

interface AttendanceModalState {
    isOpen: boolean;
    meeting: Meeting | null;
    onOpen: (meeting: Meeting) => void;
    onClose: () => void;
}

export const useAttendanceModalStore = create<AttendanceModalState>((set) => ({
    isOpen: false,
    meeting: null,
    onOpen: (meeting) => set({ isOpen: true, meeting }),
    onClose: () => set({ isOpen: false, meeting: null }),
}));
