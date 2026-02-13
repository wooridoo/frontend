import { create } from 'zustand';

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolver: ((value: boolean) => void) | null;
  open: (options: ConfirmDialogOptions) => Promise<boolean>;
  resolve: (value: boolean) => void;
  close: () => void;
}

const initialState: Omit<ConfirmDialogState, 'open' | 'resolve' | 'close'> = {
  isOpen: false,
  title: '',
  description: '',
  confirmText: '확인',
  cancelText: '취소',
  variant: 'default',
  resolver: null,
};

export const useConfirmDialogStore = create<ConfirmDialogState>((set, get) => ({
  ...initialState,
  open: options =>
    new Promise<boolean>(resolve => {
      const previousResolver = get().resolver;
      if (previousResolver) {
        previousResolver(false);
      }

      set({
        ...initialState,
        ...options,
        isOpen: true,
        resolver: resolve,
      });
    }),
  resolve: value => {
    const resolver = get().resolver;
    if (resolver) {
      resolver(value);
    }
    set({ ...initialState });
  },
  close: () => {
    const resolver = get().resolver;
    if (resolver) {
      resolver(false);
    }
    set({ ...initialState });
  },
}));

export function useConfirmDialog() {
  const open = useConfirmDialogStore(state => state.open);
  return { confirm: open };
}
